"use client";

import { useState, useEffect } from "react";

interface CreateQuoteRequest {
  base_currency: string;
  quote_currency: string;
  side: string;
  quantity: string;
}

interface CreateOrderRequest {
  base_currency: string;
  quote_currency: string;
  side: string;
  quantity: string;
  price: string;
  quote_id: string;
}

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState<"quote" | "order" | "orders">("quote");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [orders, setOrders] = useState<unknown[]>([]);
  
  const [quoteForm, setQuoteForm] = useState<CreateQuoteRequest>({
    base_currency: "BTC",
    quote_currency: "USD",
    side: "buy",
    quantity: "",
  });

  const [orderForm, setOrderForm] = useState<CreateOrderRequest>({
    base_currency: "BTC",
    quote_currency: "USD",
    side: "buy",
    quantity: "",
    price: "",
    quote_id: "",
  });

  const createQuote = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch("http://localhost:8080/api/v1/trading/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteForm),
      });
      const data = await response.json();
      setResult(data);
      if (data.success && data.id) {
        setOrderForm(prev => ({ ...prev, quote_id: data.id, price: data.price }));
      }
    } catch (error) {
      setResult({ error: "Failed to create quote", details: error });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch("http://localhost:8080/api/v1/trading/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderForm),
      });
      const data = await response.json();
      setResult(data);
      if (data.success) {
        fetchOrders();
      }
    } catch (error) {
      setResult({ error: "Failed to create order", details: error });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/trading/orders");
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

  const handleQuoteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ ...prev, [name]: value }));
  };

  const copyQuoteToOrder = () => {
    setOrderForm(prev => ({
      ...prev,
      base_currency: quoteForm.base_currency,
      quote_currency: quoteForm.quote_currency,
      side: quoteForm.side,
      quantity: quoteForm.quantity,
    }));
    setActiveTab("order");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8 pt-6">
            {[
              { key: "quote", label: "Get Quote" },
              { key: "order", label: "Place Order" },
              { key: "orders", label: "Order History" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Quote Tab */}
          {activeTab === "quote" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Create Trading Quote</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="base_currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Base Currency
                  </label>
                  <select
                    id="base_currency"
                    name="base_currency"
                    value={quoteForm.base_currency}
                    onChange={handleQuoteInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="LTC">Litecoin (LTC)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quote_currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Quote Currency
                  </label>
                  <select
                    id="quote_currency"
                    name="quote_currency"
                    value={quoteForm.quote_currency}
                    onChange={handleQuoteInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="NGN">Nigerian Naira (NGN)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="side" className="block text-sm font-medium text-gray-700 mb-2">
                    Side
                  </label>
                  <select
                    id="side"
                    name="side"
                    value={quoteForm.side}
                    onChange={handleQuoteInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={quoteForm.quantity}
                    onChange={handleQuoteInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.001"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={createQuote}
                  disabled={isLoading}
                  className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Getting Quote..." : "Get Quote"}
                </button>
                {result && result.success && (
                  <button
                    onClick={copyQuoteToOrder}
                    className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
                  >
                    Use Quote for Order
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Order Tab */}
          {activeTab === "order" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Place Trading Order</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="order_base_currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Base Currency
                  </label>
                  <select
                    id="order_base_currency"
                    name="base_currency"
                    value={orderForm.base_currency}
                    onChange={handleOrderInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="LTC">Litecoin (LTC)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="order_quote_currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Quote Currency
                  </label>
                  <select
                    id="order_quote_currency"
                    name="quote_currency"
                    value={orderForm.quote_currency}
                    onChange={handleOrderInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="NGN">Nigerian Naira (NGN)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="order_side" className="block text-sm font-medium text-gray-700 mb-2">
                    Side
                  </label>
                  <select
                    id="order_side"
                    name="side"
                    value={orderForm.side}
                    onChange={handleOrderInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="order_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="text"
                    id="order_quantity"
                    name="quantity"
                    value={orderForm.quantity}
                    onChange={handleOrderInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.001"
                  />
                </div>

                <div>
                  <label htmlFor="order_price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    id="order_price"
                    name="price"
                    value={orderForm.price}
                    onChange={handleOrderInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Price per unit"
                  />
                </div>

                <div>
                  <label htmlFor="quote_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Quote ID
                  </label>
                  <input
                    type="text"
                    id="quote_id"
                    name="quote_id"
                    value={orderForm.quote_id}
                    onChange={handleOrderInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quote ID from previous quote"
                  />
                </div>
              </div>

              <button
                onClick={createOrder}
                disabled={isLoading}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
                <button
                  onClick={fetchOrders}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Refresh
                </button>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No orders found. Create a quote and place an order to see them here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pair
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Side
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order, index) => (
                        <tr key={order.id || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id?.substring(0, 8) || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.base_currency}/{order.quote_currency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`capitalize ${order.side === "buy" ? "text-green-600" : "text-red-600"}`}>
                              {order.side}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              order.status === "filled" ? "bg-green-100 text-green-800" :
                              order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Response</h3>
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}