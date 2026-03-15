export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            W3B3 - Multi-Chain Staking & Yield Portal
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Discover, assess, and stake on verified opportunities across multiple blockchains
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition">
            Connect Wallet
          </button>
        </div>
      </div>
    </main>
  );
}
