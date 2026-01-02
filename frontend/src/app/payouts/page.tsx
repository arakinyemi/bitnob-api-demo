"use client";

import { useState } from "react";

interface PayoutQuoteRequest {
  source: string;
  fromAsset: string;
  toCurrency: string;
  chain?: string;
  amount?: number;
  settlementAmount?: number;
}

interface InitializePayoutRequest {
  quoteId: string;
  customerId: string;
  country: string;
  reference: string;
  paymentReason: string;
  beneficiary: {
    type: string;
    bankCode?: string;
    accountName?: string;
    accountNumber?: string;
    phoneNumber?: string;
  };
}

type PayoutStep = "quote" | "initialize" | "finalize";

export default function PayoutsPage() {
  const [currentStep, setCurrentStep] = useState<PayoutStep>("quote");
  const [quoteData, setQuoteData] = useState<unknown>(null);
  const [initializeData, setInitializeData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [quoteForm, setQuoteForm] = useState<PayoutQuoteRequest>({
    source: "balance",
    fromAsset: "BTC",
    toCurrency: "NGN",
    chain: "bitcoin",
    amount: 0,
  });

  const [initializeForm, setInitializeForm] = useState<InitializePayoutRequest>({
    quoteId: "",
    customerId: "",
    country: "NG",
    reference: "",
    paymentReason: "personal",
    beneficiary: {
      type: "bank",
      bankCode: "",
      accountName: "",
      accountNumber: "",
    },
  });

  const createQuote = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/payouts/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteForm),
      });
      const data = await response.json();
      setQuoteData(data);
      setInitializeForm(prev => ({ ...prev, quoteId: data.id || data.quoteId }));
      setCurrentStep("initialize");
    } catch (error) {
      console.error("Quote creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializePayout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/payouts/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initializeForm),
      });
      const data = await response.json();
      setInitializeData(data);
      setCurrentStep("finalize");
    } catch (error) {
      console.error("Payout initialization failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const finalizePayout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/payouts/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: initializeForm.quoteId }),
      });
      const data = await response.json();
      alert("Payout completed successfully!");
      console.log("Finalization result:", data);
    } catch (error) {
      console.error("Payout finalization failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setCurrentStep("quote");
    setQuoteData(null);
    setInitializeData(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">International Payouts</h1>

        {/* Step indicator */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {["quote", "initialize", "finalize"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step
                      ? "bg-blue-600 text-white"
                      : index < ["quote", "initialize", "finalize"].indexOf(currentStep)
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium capitalize">{step}</span>
                {index < 2 && <div className="w-8 h-0.5 bg-gray-300 ml-4"></div>}
              </div>
            ))}
          </div>
          <button
            onClick={resetFlow}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Start Over
          </button>
        </div>

        {/* Quote Step */}
        {currentStep === "quote" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Create Quote</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Asset</label>
                <select
                  value={quoteForm.fromAsset}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, fromAsset: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Currency</label>
                <select
                  value={quoteForm.toCurrency}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, toCurrency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NGN">Nigerian Naira (NGN)</option>
                  <option value="GHS">Ghanaian Cedi (GHS)</option>
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="USD">US Dollar (USD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={quoteForm.amount || ""}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.001"
                  step="0.000001"
                />
              </div>
            </div>
            <button
              onClick={createQuote}
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating Quote..." : "Create Quote"}
            </button>
          </div>
        )}

        {/* Initialize Step */}
        {currentStep === "initialize" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Initialize Payout</h2>
            {quoteData && (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-green-900">Quote Created</h3>
                <p className="text-green-700 text-sm">
                  Rate: {quoteData.exchangeRate} | Amount: {quoteData.settlementAmount} {quoteData.settlementCurrency}
                </p>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
                <input
                  type="text"
                  value={initializeForm.customerId}
                  onChange={(e) => setInitializeForm(prev => ({ ...prev, customerId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                <input
                  type="text"
                  value={initializeForm.reference}
                  onChange={(e) => setInitializeForm(prev => ({ ...prev, reference: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                <input
                  type="text"
                  value={initializeForm.beneficiary.accountName}
                  onChange={(e) => setInitializeForm(prev => ({ 
                    ...prev, 
                    beneficiary: { ...prev.beneficiary, accountName: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={initializeForm.beneficiary.accountNumber}
                  onChange={(e) => setInitializeForm(prev => ({ 
                    ...prev, 
                    beneficiary: { ...prev.beneficiary, accountNumber: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Code</label>
                <input
                  type="text"
                  value={initializeForm.beneficiary.bankCode}
                  onChange={(e) => setInitializeForm(prev => ({ 
                    ...prev, 
                    beneficiary: { ...prev.beneficiary, bankCode: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 044"
                />
              </div>
            </div>
            <button
              onClick={initializePayout}
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Initializing..." : "Initialize Payout"}
            </button>
          </div>
        )}

        {/* Finalize Step */}
        {currentStep === "finalize" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Finalize Payout</h2>
            {initializeData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900">Payout Initialized</h3>
                <p className="text-blue-700 text-sm">
                  ID: {initializeData.id} | Status: {initializeData.status}
                </p>
                <p className="text-blue-700 text-sm">
                  Address: {initializeData.address}
                </p>
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={finalizePayout}
                disabled={isLoading}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "Finalizing..." : "Complete Payout"}
              </button>
              <button
                onClick={resetFlow}
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400"
              >
                Start New Payout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}