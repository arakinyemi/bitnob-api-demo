"use client";

import { useState } from "react";

interface PayoutQuoteRequest {
  source: string;
  fromAsset: string;
  toCurrency: string;
  chain?: string;
  amount?: number;
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
  const [quoteData, setQuoteData] = useState<Record<string, unknown> | null>(
    null,
  );
  const [initializeData, setInitializeData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [quoteForm, setQuoteForm] = useState<PayoutQuoteRequest>({
    source: "onchain",
    fromAsset: "usdt",
    toCurrency: "ngn", 
    chain: "trc20",
    amount: 0,
  });

  const [initializeForm, setInitializeForm] = useState<InitializePayoutRequest>(
    {
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
    },
  );

  const getAvailableChains = () => {
    if (quoteForm.fromAsset === "btc") {
      return [{ value: "bitcoin", label: "Bitcoin" }];
    } else if (quoteForm.fromAsset === "usdt") {
      return [
        { value: "trc20", label: "Tron (TRC20)" },
        { value: "polygon", label: "Polygon" },
        { value: "bsc", label: "Binance Smart Chain" },
      ];
    } else if (quoteForm.fromAsset === "usdc") {
      return [
        { value: "polygon", label: "Polygon" },
        { value: "bsc", label: "Binance Smart Chain" },
      ];
    } else {
      return [{ value: "trc20", label: "Tron (TRC20)" }];
    }
  };

  const createQuote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/api/payouts/quotes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quoteForm),
        },
      );
      const data = await response.json();
      
      if (!response.ok) {
        setError(`Failed to create quote: ${data.error || data.details || 'Unknown error'}`);
        setQuoteData(data);
        return;
      }
      
      setQuoteData(data);
      setInitializeForm((prev) => ({
        ...prev,
        quoteId: data.data?.id || data.id || data.quoteId,
      }));
      setCurrentStep("initialize");
    } catch (error) {
      console.error("Quote creation failed:", error);
      setError(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const initializePayout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Ensure reference is not empty
      const requestData = {
        ...initializeForm,
        reference: initializeForm.reference || `payout_${Date.now()}`
      };

      const response = await fetch(
        "http://localhost:8080/api/payouts/initialize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        },
      );
      const data = await response.json();
      
      if (!response.ok) {
        setError(`Failed to initialize payout: ${data.error || data.details || 'Unknown error'}`);
        setInitializeData(data);
        return;
      }
      
      setInitializeData(data);
      setCurrentStep("finalize");
    } catch (error) {
      console.error("Payout initialization failed:", error);
      setError(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const finalizePayout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/api/payouts/finalize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quoteId: initializeForm.quoteId }),
        },
      );
      const data = await response.json();
      
      if (!response.ok) {
        setError(`Failed to finalize payout: ${data.error || data.details || 'Unknown error'}`);
        return;
      }
      
      alert("Payout completed successfully!");
      console.log("Finalization result:", data);
    } catch (error) {
      console.error("Payout finalization failed:", error);
      setError(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setCurrentStep("quote");
    setQuoteData(null);
    setInitializeData(null);
    setError(null);
  };

  const steps = [
    { id: "quote", label: "Quote", number: 1 },
    { id: "initialize", label: "Initialize", number: 2 },
    { id: "finalize", label: "Finalize", number: 3 },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-black mb-3">
            International Payouts
          </h1>
          <p className="text-lg text-gray-600">
            Send money to bank accounts and mobile wallets worldwide
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      currentStepIndex >= index
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium ${
                      currentStepIndex >= index ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-0.5 transition-all ${
                        currentStepIndex > index ? "bg-black" : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 border border-red-200 bg-red-50 rounded-lg p-6">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Response Data Display */}
        {quoteData && error && (
          <div className="mb-8 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-black mb-4">API Response</h3>
            <pre className="text-sm text-gray-600 overflow-auto bg-gray-50 p-4 rounded-lg font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(quoteData, null, 2)}
            </pre>
          </div>
        )}

        {/* Quote Step */}
        {currentStep === "quote" && (
          <div className="animate-fade-in">
            <div className="border border-gray-200 rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-black">
                  Create Quote
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      From Asset
                    </label>
                    <select
                      value={quoteForm.fromAsset}
                      onChange={(e) => {
                        const newFromAsset = e.target.value;
                        const defaultChain =
                          newFromAsset === "btc" ? "bitcoin" : 
                          newFromAsset === "usdt" ? "trc20" : "polygon";
                        setQuoteForm((prev) => ({
                          ...prev,
                          fromAsset: newFromAsset,
                          chain: defaultChain,
                        }));
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none bg-white text-black"
                    >
                      <option value="btc">Bitcoin (BTC)</option>
                      <option value="usdt">Tether (USDT)</option>
                      <option value="usdc">USD Coin (USDC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Blockchain Network
                    </label>
                    <select
                      value={quoteForm.chain || "trc20"}
                      onChange={(e) =>
                        setQuoteForm((prev) => ({
                          ...prev,
                          chain: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none bg-white text-black"
                    >
                      {getAvailableChains().map((chain) => (
                        <option key={chain.value} value={chain.value}>
                          {chain.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      To Currency
                    </label>
                    <select
                      value={quoteForm.toCurrency}
                      onChange={(e) =>
                        setQuoteForm((prev) => ({
                          ...prev,
                          toCurrency: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all appearance-none bg-white text-black"
                    >
                      <option value="ngn">Nigerian Naira (NGN)</option>
                      <option value="ghs">Ghanaian Cedi (GHS)</option>
                      <option value="kes">Kenyan Shilling (KES)</option>
                      <option value="usd">US Dollar (USD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={quoteForm.amount || ""}
                      onChange={(e) =>
                        setQuoteForm((prev) => ({
                          ...prev,
                          amount: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white text-black"
                      placeholder="0.001"
                      step="0.000001"
                    />
                  </div>
                </div>

                <button
                  onClick={createQuote}
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all font-medium"
                >
                  {isLoading ? "Creating Quote..." : "Create Quote"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Initialize Step */}
        {currentStep === "initialize" && (
          <div className="animate-fade-in">
            <div className="border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-black mb-6">
                Initialize Payout
              </h2>

              {quoteData && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-black mb-2">
                        Quote Created Successfully
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium text-black">
                            Exchange Rate:
                          </span>{" "}
                          {quoteData.exchangeRate as string}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium text-black">
                            Settlement Amount:
                          </span>{" "}
                          {quoteData.settlementAmount as string}{" "}
                          {quoteData.settlementCurrency as string}
                        </p>
                      </div>
                    </div>
                    <svg
                      className="w-6 h-6 text-black"
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
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Customer ID
                    </label>
                    <input
                      type="text"
                      value={initializeForm.customerId}
                      onChange={(e) =>
                        setInitializeForm((prev) => ({
                          ...prev,
                          customerId: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white text-black"
                      placeholder="Enter customer ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Reference
                    </label>
                    <input
                      type="text"
                      value={initializeForm.reference}
                      onChange={(e) =>
                        setInitializeForm((prev) => ({
                          ...prev,
                          reference: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white text-black"
                      placeholder="Transaction reference"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      value={initializeForm.beneficiary.accountName}
                      onChange={(e) =>
                        setInitializeForm((prev) => ({
                          ...prev,
                          beneficiary: {
                            ...prev.beneficiary,
                            accountName: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white text-black"
                      placeholder="Beneficiary name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={initializeForm.beneficiary.accountNumber}
                      onChange={(e) =>
                        setInitializeForm((prev) => ({
                          ...prev,
                          beneficiary: {
                            ...prev.beneficiary,
                            accountNumber: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white text-black"
                      placeholder="Account number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Bank Code
                    </label>
                    <input
                      type="text"
                      value={initializeForm.beneficiary.bankCode}
                      onChange={(e) =>
                        setInitializeForm((prev) => ({
                          ...prev,
                          beneficiary: {
                            ...prev.beneficiary,
                            bankCode: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white text-black"
                      placeholder="e.g., 044"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={initializePayout}
                    disabled={isLoading}
                    className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all font-medium"
                  >
                    {isLoading ? "Initializing..." : "Initialize Payout"}
                  </button>
                  <button
                    onClick={() => setCurrentStep("quote")}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Finalize Step */}
        {currentStep === "finalize" && (
          <div className="animate-fade-in">
            <div className="border border-gray-200 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-black mb-6">
                Finalize Payout
              </h2>

              {initializeData && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-black">
                      Payout Initialized
                    </h3>
                    <svg
                      className="w-6 h-6 text-black"
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
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium text-black">ID:</span>{" "}
                      {initializeData.id as string}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium text-black">Status:</span>{" "}
                      {initializeData.status as string}
                    </p>
                    <p className="text-gray-600 break-all">
                      <span className="font-medium text-black">Address:</span>{" "}
                      {initializeData.address as string}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Review the details above and click the button below to
                    complete the payout transaction.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={finalizePayout}
                    disabled={isLoading}
                    className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all font-medium"
                  >
                    {isLoading ? "Finalizing..." : "Complete Payout"}
                  </button>
                  <button
                    onClick={resetFlow}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  >
                    Start New
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
