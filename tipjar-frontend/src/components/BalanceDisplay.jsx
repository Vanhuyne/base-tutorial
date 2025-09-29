import { useEffect, useState } from "react";
import { getContract } from "../utils/contract";

export default function BalanceDisplay({ provider }) {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (!provider) return;
    async function fetchBalance() {
      const contract = getContract(provider);
      const bal = await contract.getBalance();
      setBalance(ethers.formatEther(bal));
    }
    fetchBalance();
  }, [provider]);

  return <p>💰 Tổng tiền trong TipJar: {balance} CELO</p>;
}
