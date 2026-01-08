"use client";

import { useState } from "react";

interface TransferRequest {
  to_address: string;
  amount: string;
  currency: string;
  chain: string;
  reference: string;
  description: string;
}

export default function TransfersPage() {
  const [formData, setFormData] = useState<TransferRequest>({
    to_address: "",
    amount: "",
    currency: "BTC",
    chain: "bitcoin",
    reference: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      console.log("Making request to backend...", formData);
      
      // Ensure reference is not empty
      const requestData = {
        ...formData,
        reference: formData.reference || `transfer_${Date.now()}`
      };
      
      const response = await fetch("http://localhost:8080/api/wallets/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const data = await response.json();
      console.log("Response data:", data);
      
      // Always show the response, whether it's success or error
      setResult(data);
    } catch (error) {
      console.error("Request error:", error);
      setResult({ 
        error: "Request failed", 
        details: {
          message: error instanceof Error ? error.message : String(error),
          status: "Network or parsing error",
          url: "http://localhost:8080/api/wallets/transfers",
          formData: {
            ...formData,
            reference: formData.reference || `transfer_${Date.now()}`
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "currency") {
      const defaultChain = value === "BTC" ? "bitcoin" : "polygon";
      setFormData((prev) => ({ ...prev, [name]: value, chain: defaultChain }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getAvailableChains = () => {
    if (formData.currency === "BTC") {
      return [{ value: "bitcoin", label: "Bitcoin" }];
    } else {
      return [
        { value: "polygon", label: "Polygon" },
        { value: "bsc", label: "Binance Smart Chain" },
      ];
    }
  };

  const resetForm = () => {
    setFormData({
      to_address: "",
      amount: "",
      currency: "BTC",
      chain: "bitcoin",
      reference: "",
      description: "",
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-black mb-3">
            Create Transfer
          </h1>
          <p className="text-lg text-gray-600">
            Send cryptocurrency to any blockchain address
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Address */}
              <div>
                <label
                  htmlFor="to_address"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Recipient Address *
                </label>
                <input
                  type="text"
                  id="to_address"
                  name="to_address"
                  value={formData.to_address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Enter wallet address"
                />
              </div>

              {/* Amount and Currency */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Amount *
                  </label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-black"
                    placeholder="0.001"
                  />
                </div>

                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Currency *
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none bg-white text-black"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="USDT">Tether (USDT)</option>
                    <option value="USDC">USD Coin (USDC)</option>
                  </select>
                </div>
              </div>

              {/* Chain */}
              <div>
                <label
                  htmlFor="chain"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Blockchain Network *
                </label>
                <select
                  id="chain"
                  name="chain"
                  value={formData.chain}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none bg-white text-black"
                >
                  {getAvailableChains().map((chain) => (
                    <option key={chain.value} value={chain.value}>
                      {chain.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reference */}
              <div>
                <label
                  htmlFor="reference"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Reference
                  <span className="text-gray-400 font-normal ml-1">
                    (Optional)
                  </span>
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white text-black"
                  placeholder="Internal reference"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Description
                  <span className="text-gray-400 font-normal ml-1">
                    (Optional)
                  </span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none bg-white text-black"
                  placeholder="Add notes about this transfer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                >
                  {isLoading ? "Creating Transfer..." : "Create Transfer"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">
                Transfer Info
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Supported Assets</div>
                  <div className="text-black">BTC, USDT, USDC</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Networks</div>
                  <div className="text-black">Bitcoin, Polygon, BSC</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Processing Time</div>
                  <div className="text-black">5-30 minutes</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Double-check the recipient address before submitting.
                  Cryptocurrency transactions are irreversible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-8 border border-gray-200 rounded-lg p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Response</h3>
              <button
                onClick={() => setResult(null)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <pre className="text-sm text-gray-600 overflow-auto bg-gray-50 p-4 rounded-lg font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
