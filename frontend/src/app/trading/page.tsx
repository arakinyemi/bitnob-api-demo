"use client";

import { useState, useEffect } from "react";

interface CreateOrderRequest {
  base_currency: string;
  quote_currency: string;
  side: string;
  quantity: string;
  price?: string;
}

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState<"trade" | "orders">("trade");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [quoteResult, setQuoteResult] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [orderResult, setOrderResult] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);

  const [orderForm, setOrderForm] = useState<CreateOrderRequest>({
    base_currency: "BTC",
    quote_currency: "USDT",
    side: "buy",
    quantity: "",
    price: "",
  });

  const createQuote = async () => {
    setIsLoading(true);
    setQuoteResult(null);
    setOrderResult(null);

    try {
      const quoteResponse = await fetch(
        "http://localhost:8080/api/trading/quotes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base_currency: orderForm.base_currency,
            quote_currency: orderForm.quote_currency,
            side: orderForm.side,
            quantity: orderForm.quantity,
          }),
        },
      );

      const quoteData = await quoteResponse.json();
      console.log("Quote response:", quoteData);
      setQuoteResult(quoteData);
    } catch (error) {
      setQuoteResult({ error: "Failed to create quote", details: error });
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeOrder = async () => {
    console.log("Quote result for finalization:", quoteResult);
    
    // Handle different possible quote response structures
    const quoteId = quoteResult?.id || quoteResult?.data?.id || quoteResult?.data?.data?.quote?.id;
    const quotePrice = quoteResult?.price || quoteResult?.data?.price || quoteResult?.data?.data?.quote?.price;
    
    if (!quoteResult || !quoteId) {
      setOrderResult({ error: "No quote available to finalize", debug: { quoteResult } });
      return;
    }

    setIsCreatingOrder(true);
    setOrderResult(null);

    try {
      const orderResponse = await fetch(
        "http://localhost:8080/api/trading/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base_currency: orderForm.base_currency,
            quote_currency: orderForm.quote_currency,
            side: orderForm.side,
            quantity: orderForm.quantity,
            price: orderForm.price || quotePrice,
            quote_id: quoteId,
            metadata: {
              reference: `user-order-${Date.now()}`,
            },
          }),
        },
      );

      const orderData = await orderResponse.json();
      setOrderResult(orderData);

      if (orderData.success) {
        // Refresh orders list
        fetchOrders();
        // Reset form and quote
        setOrderForm({
          base_currency: "BTC",
          quote_currency: "USDT",
          side: "buy",
          quantity: "",
          price: "",
        });
        setQuoteResult(null);
      }
    } catch (error) {
      setOrderResult({ error: "Failed to create order", details: error });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/trading/orders",
      );
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { key: "trade" as const, label: "Place Order" },
    { key: "orders" as const, label: "Order History" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-black mb-3">
            Trading
          </h1>
          <p className="text-lg text-gray-600">
            Execute cryptocurrency trading orders instantly
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.key
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Trade Tab */}
        {activeTab === "trade" && (
          <div className="animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order Form */}
              <div className="lg:col-span-2">
                <div className="border border-gray-200 rounded-lg p-8">
                  <h2 className="text-2xl font-semibold text-black mb-6">
                    Place Order
                  </h2>

                  <div className="space-y-6">
                    {/* Trading Pair */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="base_currency"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Base Currency
                        </label>
                        <select
                          id="base_currency"
                          name="base_currency"
                          value={orderForm.base_currency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none bg-white"
                        >
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="USDT">Tether (USDT)</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="quote_currency"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Quote Currency
                        </label>
                        <select
                          id="quote_currency"
                          name="quote_currency"
                          value={orderForm.quote_currency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none bg-white"
                        >
                          <option value="USDT">Tether (USDT)</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                        </select>
                      </div>
                    </div>

                    {/* Side */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-3">
                        Order Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setOrderForm((prev) => ({ ...prev, side: "buy" }))
                          }
                          className={`py-3 px-6 rounded-lg font-medium transition-all ${
                            orderForm.side === "buy"
                              ? "bg-black text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Buy
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setOrderForm((prev) => ({ ...prev, side: "sell" }))
                          }
                          className={`py-3 px-6 rounded-lg font-medium transition-all ${
                            orderForm.side === "sell"
                              ? "bg-black text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Sell
                        </button>
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Quantity
                        </label>
                        <input
                          type="text"
                          id="quantity"
                          name="quantity"
                          value={orderForm.quantity}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                          placeholder="0.001"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-black mb-2"
                        >
                          Price
                          <span className="text-gray-400 font-normal ml-1">
                            (Optional)
                          </span>
                        </label>
                        <input
                          type="text"
                          id="price"
                          name="price"
                          value={orderForm.price}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                          placeholder="Market price"
                        />
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        {orderForm.price
                          ? "Your order will be executed at the specified price."
                          : "Leaving price empty will use the current market rate."}
                      </p>
                    </div>

                    {/* Submit Buttons */}
                    {!quoteResult ? (
                      <button
                        onClick={createQuote}
                        disabled={isLoading || !orderForm.quantity}
                        className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        {isLoading ? "Creating Quote..." : "Get Quote"}
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => {
                            setQuoteResult(null);
                            setOrderResult(null);
                          }}
                          className="py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                        >
                          New Quote
                        </button>
                        <button
                          onClick={finalizeOrder}
                          disabled={isCreatingOrder}
                          className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                          {isCreatingOrder ? "Finalizing..." : "Finalize Order"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quote Result */}
                  {quoteResult && (
                    <div className="mt-6 border-t border-gray-200 pt-6 animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-black uppercase tracking-wide">
                          Quote Details
                        </h3>
                        {((quoteResult.success as boolean) || (quoteResult.data?.success && !quoteResult.error)) && (
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {quoteResult.error ? (
                          <div className="text-red-600 text-sm">
                            Error: {String(quoteResult.error)}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {((quoteResult.price as string) || (quoteResult.data?.price as string) || (quoteResult.data?.data?.quote?.price as string)) && (
                              <div>
                                <div className="text-gray-500 mb-1">Price</div>
                                <div className="text-black font-medium">
                                  {((quoteResult.price as string) || (quoteResult.data?.price as string) || (quoteResult.data?.data?.quote?.price as string))} {orderForm.quote_currency}
                                </div>
                              </div>
                            )}
                            {((quoteResult.quantity as string) || (quoteResult.data?.quantity as string) || (quoteResult.data?.data?.quote?.quantity as string)) && (
                              <div>
                                <div className="text-gray-500 mb-1">Quantity</div>
                                <div className="text-black font-medium">
                                  {((quoteResult.quantity as string) || (quoteResult.data?.quantity as string) || (quoteResult.data?.data?.quote?.quantity as string))} {orderForm.base_currency}
                                </div>
                              </div>
                            )}
                            {((quoteResult.side as string) || (quoteResult.data?.side as string) || (quoteResult.data?.data?.quote?.side as string)) && (
                              <div>
                                <div className="text-gray-500 mb-1">Side</div>
                                <div className="text-black font-medium capitalize">
                                  {(((quoteResult.side as string) || (quoteResult.data?.side as string) || (quoteResult.data?.data?.quote?.side as string))?.toLowerCase() || "")}
                                </div>
                              </div>
                            )}
                            {((quoteResult.expires_at as string) || (quoteResult.data?.expires_at as string) || (quoteResult.data?.data?.quote?.expires_at as string)) && (
                              <div>
                                <div className="text-gray-500 mb-1">Expires At</div>
                                <div className="text-black font-medium text-xs">
                                  {new Date(((quoteResult.expires_at as string) || (quoteResult.data?.expires_at as string) || (quoteResult.data?.data?.quote?.expires_at as string))).toLocaleString()}
                                </div>
                              </div>
                            )}
                            {((quoteResult.id as string) || (quoteResult.data?.id as string) || (quoteResult.data?.data?.quote?.id as string)) && (
                              <div className="md:col-span-2">
                                <div className="text-gray-500 mb-1">Quote ID</div>
                                <div className="text-black font-mono text-xs bg-white p-2 rounded border">
                                  {((quoteResult.id as string) || (quoteResult.data?.id as string) || (quoteResult.data?.data?.quote?.id as string))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {((quoteResult.success as boolean) || (quoteResult.data?.success && !quoteResult.error)) && (
                        <div className="mt-3 text-xs text-gray-500 text-center">
                          Review the quote details above and click "Finalize Order" to proceed with the trade
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order Result */}
                  {orderResult && (
                    <div className="mt-4 animate-fade-in">
                      {(orderResult.success as boolean) ? (
                        <div className="bg-black text-white rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <svg
                              className="w-6 h-6 shrink-0 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <div>
                              <h4 className="font-semibold mb-1">
                                Order Placed Successfully
                              </h4>
                              <p className="text-sm text-gray-200">
                                Your {orderForm.side} order for{" "}
                                {orderForm.quantity} {orderForm.base_currency}{" "}
                                has been executed.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <pre className="text-sm text-gray-600 overflow-auto font-mono">
                            {JSON.stringify(orderResult, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Info Sidebar */}
              <div className="lg:col-span-1">
                <div className="border border-gray-200 rounded-lg p-6 sticky top-24">
                  <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">
                    Trading Info
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Available Pairs</div>
                      <div className="text-black">
                        BTC/USDT, USDT/BTC
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Order Types</div>
                      <div className="text-black">Market & Limit Orders</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Execution</div>
                      <div className="text-black">Instant Settlement</div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Orders are processed in real-time. The system
                      automatically fetches the best available quote and
                      executes your trade.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="animate-fade-in">
            <div className="border border-gray-200 rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-black">
                  Order History
                </h2>
                <button
                  onClick={fetchOrders}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Refresh
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-500">
                    No orders found. Place your first order to see it here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Pair
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Side
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order: Record<string, unknown>, index) => (
                        <tr
                          key={(order.id as string) || index}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            {(order.id as string)?.substring(0, 8) || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {order.base_currency as string}/
                            {order.quote_currency as string}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`capitalize font-medium ${
                                order.side === "buy"
                                  ? "text-black"
                                  : "text-gray-600"
                              }`}
                            >
                              {order.side as string}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.quantity as string}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.price as string}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                order.status === "filled"
                                  ? "bg-black text-white"
                                  : order.status === "pending"
                                    ? "bg-gray-200 text-gray-800"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {order.status as string}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
