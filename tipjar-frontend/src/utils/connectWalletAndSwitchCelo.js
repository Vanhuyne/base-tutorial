import { ethers } from "ethers";


const CELO_ALFAJORES_PARAMS = {
  chainId: "0xA4EC", // 44787 decimal → 0xAD6F hex
  chainName: "Celo",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: ["https://forno.celo.org"],
  blockExplorerUrls: ["https://celoscan.io"],
};
export async function connectWalletAndSwitchCelo() {
  if (!window.ethereum) throw new Error("No wallet found");

  const provider = new ethers.BrowserProvider(window.ethereum);

  // Yêu cầu connect
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  try {
    // thử switch sang Celo Alfajores
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CELO_ALFAJORES_PARAMS.chainId }],
    });
    console.log("Switched to Celo Alfajores");
  } catch (switchError) {
    // Nếu chain chưa được thêm trong MetaMask
    if (switchError.code === 4902) {
      console.log("Celo Alfajores chưa tồn tại trong MetaMask, thêm chain...");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [CELO_ALFAJORES_PARAMS],
      });
    } else {
      throw switchError;
    }
  }

  // Lấy balance CELO trên Alfajores
  const network = await provider.getNetwork();
  const balanceWei = await provider.getBalance(address);
  const balanceCELO = ethers.formatEther(balanceWei);

  return { provider, signer, address, network, balanceCELO };
}
