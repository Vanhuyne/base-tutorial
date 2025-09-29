import { useState } from "react";
import { ethers } from "ethers";         // ← thêm dòng này
import { getContract } from "../utils/contract";

export default function TipForm({ signer }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  async function sendTip() {
    if (!signer) {
      alert("Kết nối ví trước!");
      return;
    }
    const contract = getContract(signer);
    const tx = await contract.tip(message, {
      value: ethers.parseEther(amount),  // ethers.parseEther cần import ethers
    });
    await tx.wait();
    alert("Tip thành công!");
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Số CELO muốn tip"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border rounded p-2 w-full"
      />
      <input
        type="text"
        placeholder="Lời nhắn (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border rounded p-2 w-full"
      />
      <button
        onClick={sendTip}
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Gửi Tip
      </button>
    </div>
  );
}
