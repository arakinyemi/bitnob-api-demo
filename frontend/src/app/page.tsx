import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black mb-6">
            Cryptocurrency payments made simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Demo platform for cryptocurrency transfers, international payouts,
            and trading operations powered by Bitnob API.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Link href="/transfers" className="group">
            <div className="border border-gray-200 rounded-lg p-8 hover:border-black transition-all duration-200 hover:shadow-sm">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                Transfers
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Send cryptocurrency to any blockchain address with support for
                multiple currencies and networks.
              </p>
              <div className="flex items-center text-sm font-medium text-black">
                Get started
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/payouts" className="group">
            <div className="border border-gray-200 rounded-lg p-8 hover:border-black transition-all duration-200 hover:shadow-sm">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Payouts</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Send money internationally to bank accounts and mobile wallets
                using cryptocurrency as settlement.
              </p>
              <div className="flex items-center text-sm font-medium text-black">
                Get started
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link href="/trading" className="group">
            <div className="border border-gray-200 rounded-lg p-8 hover:border-black transition-all duration-200 hover:shadow-sm">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Trading</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Trade cryptocurrencies with real-time quotes, order management,
                and execution tracking.
              </p>
              <div className="flex items-center text-sm font-medium text-black">
                Get started
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Banner */}
        <div className="mt-16 border border-gray-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="shrink-0">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-1">Getting Started</h4>
              <p className="text-sm text-gray-600">
                Ensure your backend server is running on port 8080 with valid
                Bitnob API credentials configured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
