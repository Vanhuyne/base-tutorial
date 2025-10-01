import { useState } from 'react'
import { 
  useAppKit, 
  useAppKitAccount, 
  useAppKitNetwork,
  useDisconnect 
} from '@reown/appkit/react'
import { 
  useAccount, 
  useBalance, 
  useSendTransaction,
  useSignMessage,
  useWaitForTransactionReceipt
} from 'wagmi'
import { parseEther } from 'viem'

function App() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  
  // Transaction state
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const { data: txHash, sendTransaction, isPending } = useSendTransaction()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash })
  
  // Sign message state
  const [message, setMessage] = useState('')
  const { data: signature, signMessage, isPending: isSigning } = useSignMessage()

  // Handle send transaction
  const handleSendTransaction = async (e) => {
    e.preventDefault()
    if (!recipient || !amount) return

    try {
      sendTransaction({
        to: recipient,
        value: parseEther(amount)
      })
    } catch (error) {
      console.error('Transaction error:', error)
    }
  }

  // Handle sign message
  const handleSignMessage = async (e) => {
    e.preventDefault()
    if (!message) return

    try {
      signMessage({ message })
    } catch (error) {
      console.error('Sign error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Reown AppKit
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <appkit-button />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          /* Welcome Section */
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-slate-800/50 p-8 backdrop-blur-xl">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Welcome to Reown</h2>
                <p className="mt-3 text-slate-400">
                  Connect your wallet to start using our dApp
                </p>
              </div>

              <button
                onClick={() => open()}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-lg font-semibold text-white transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/50"
              >
                Connect Wallet
              </button>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl">✅</div>
                  <div className="mt-2 text-sm text-slate-400">600+ Wallets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">🌐</div>
                  <div className="mt-2 text-sm text-slate-400">Multi-chain</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">📧</div>
                  <div className="mt-2 text-sm text-slate-400">Email Login</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Connected Dashboard */
          <div className="space-y-6">
            {/* Account Info Card */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-6 backdrop-blur-xl">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Info
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Address
                  </label>
                  <div className="rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 font-mono text-sm text-white">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Balance
                  </label>
                  <div className="rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3">
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
                      {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0 ETH'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                    Network
                  </label>
                  <div className="rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white">
                    {caipNetwork?.name || 'Unknown'}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => open({ view: 'Account' })}
                  className="flex-1 rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-900"
                >
                  View Account
                </button>
                <button
                  onClick={() => open({ view: 'Networks' })}
                  className="flex-1 rounded-lg border border-white/10 bg-slate-900/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-900"
                >
                  Switch Network
                </button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Send Transaction Card */}
              <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-6 backdrop-blur-xl">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Send Transaction
                </h3>

                <form onSubmit={handleSendTransaction} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="0x..."
                      className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                      Amount ({balance?.symbol || 'ETH'})
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      step="0.001"
                      className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {txHash && (
                    <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                      <div className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-400">
                            {isConfirming ? 'Confirming transaction...' : 'Transaction sent!'}
                          </p>
                          <a
                            href={`https://etherscan.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-xs text-indigo-400 hover:underline"
                          >
                            View on Explorer →
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!recipient || !amount || isPending || isConfirming}
                    className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-semibold text-white transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending || isConfirming ? 'Sending...' : 'Send Transaction'}
                  </button>
                </form>
              </div>

              {/* Sign Message Card */}
              <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-6 backdrop-blur-xl">
                <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Sign Message
                </h3>

                <form onSubmit={handleSignMessage} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                      Message to Sign
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message..."
                      rows="4"
                      className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  {signature && (
                    <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                      <div className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-400">Message signed!</p>
                          <p className="mt-2 break-all font-mono text-xs text-slate-400">
                            {signature.slice(0, 30)}...{signature.slice(-30)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!message || isSigning}
                    className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-semibold text-white transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSigning ? 'Signing...' : 'Sign Message'}
                  </button>
                </form>
              </div>
            </div>

            {/* AppKit Components Demo */}
            <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-6 backdrop-blur-xl">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Built-in Components
              </h3>
              <p className="mb-6 text-sm text-slate-400">
                AppKit provides ready-to-use UI components for common actions:
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-slate-900/50 p-4">
                  <label className="mb-3 block text-xs font-medium text-slate-400">Connect Button:</label>
                  <appkit-button />
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-900/50 p-4">
                  <label className="mb-3 block text-xs font-medium text-slate-400">Network Button:</label>
                  <appkit-network-button />
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-900/50 p-4">
                  <label className="mb-3 block text-xs font-medium text-slate-400">Account Button:</label>
                  <appkit-account-button />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50 py-6">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>
            Built with{' '}
            <a
              href="https://reown.com/appkit"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-400 hover:underline"
            >
              Reown AppKit
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App