import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import TipForm from "./components/TipForm";
import BalanceDisplay from "./components/BalanceDisplay";
import WithdrawButton from "./components/WithdrawButton";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  async function handleConnect(provider, account) {
    setProvider(provider);
    setAccount(account);
    const signer = await provider.getSigner();
    setSigner(signer);
}


  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">🌟 TipJar DApp</h1>
      <ConnectWallet onConnect={handleConnect} />
      <TipForm signer={signer} />
      <BalanceDisplay provider={provider} />
      {account && <WithdrawButton signer={signer} account={account} />}
    </div>
  );
}

export default App;
