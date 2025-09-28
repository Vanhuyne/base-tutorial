import { ConnectButton } from "@rainbow-me/rainbowkit";
import { base } from "viem/op-stack";
import { BaseInfo } from "./BaseInfo";



export default function Home() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <ConnectButton showBalance={false} />
      </div>
      <BaseInfo />
      {/* Other Code... */}
    </main>
  );
}

