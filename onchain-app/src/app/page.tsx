import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { WalletInfo } from "./components/WalletInfo";
import { NFTGalleryWeb3 } from "./components/NFTGalleryWeb3";
import { NFTTransfer } from "./components/NFTTransfer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Navbar */}
      <nav className="w-full border-b border-gray-200">
        <div className="flex justify-between items-center py-4 w-full max-w-7xl mx-auto">
          <div className="font-mono text-lg font-semibold">
            Base Chain App
          </div>
          <ConnectButton showBalance={true} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
          <div className="w-full">
            <WalletInfo />
          </div>
          <div className="w-full">
            <NFTGalleryWeb3 />
          </div>
          <div className="w-full">
            <NFTTransfer />
          </div>
        </div>
      </main>
    </div>
  );
}