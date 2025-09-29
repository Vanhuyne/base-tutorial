import { ethers } from "ethers";
import TipJarJSON from "../abi/TipJar.json";  // import JSON từ Foundry

// Chỉ lấy phần abi
const abi = TipJarJSON.abi;

// Địa chỉ contract (thay bằng địa chỉ bạn deploy)
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xC7DcAdE6bd0626E154729174249901A8104d90d6";

// Hàm trả về contract với provider hoặc signer
export function getContract(runner) {
  // runner có thể là:
  // - provider: chỉ đọc (call)
  // - signer: gửi giao dịch (tip, withdraw)
  return new ethers.Contract(CONTRACT_ADDRESS, abi, runner);
}
