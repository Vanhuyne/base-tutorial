import { getContract } from "../utils/contract";

export default function WithdrawButton({ signer, account }) {
  async function withdraw() {
    const contract = getContract(signer);
    const tx = await contract.withdraw(account);
    await tx.wait();
    alert("Đã rút toàn bộ tiền!");
  }

  return (
    <button
      onClick={withdraw}
      className="px-4 py-2 bg-red-600 text-white rounded-lg mt-4"
    >
      Rút tiền
    </button>
  );
}
