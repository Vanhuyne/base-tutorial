import React, { useState } from "react";
import { connectWalletAndSwitchCelo } from "../utils/connectWalletAndSwitchCelo";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  async function handleConnect() {
    try {
      const { provider, signer, address, balanceCELO } = await connectWalletAndSwitchCelo();
      setAccount(address);
      setBalance(balanceCELO);

      // Gọi callback để cập nhật App.jsx
      if (onConnect) {
        onConnect(provider, address);
      }

      console.log("Connected:", address, "Balance:", balanceCELO);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi connect wallet: " + err.message);
    }
  }

  return (
    <div>
      {!account ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <div>
          <div>Address: {account}</div>
          <div>Balance: {balance} CELO</div>
        </div>
      )}
    </div>
  );
}
