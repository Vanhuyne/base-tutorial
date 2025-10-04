'use client';

import { useAccount, useBalance, useChainId } from 'wagmi';
import { useEffect, useState } from 'react';
import Web3 from 'web3';

export function WalletInfo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address: address,
  });

  const [web3Data, setWeb3Data] = useState<{
    blockNumber?: number;
    gasPrice?: string;
    transactionCount?: number;
  }>({});

  useEffect(() => {
    if (isConnected && address) {
      fetchWeb3Data();
    }
  }, [isConnected, address]);

  const fetchWeb3Data = async () => {
    try {
      // Initialize Web3 with RPC URL
      const rpcUrl = chainId === 8453 
        ? 'https://mainnet.base.org' // Base Mainnet
        : 'https://sepolia.base.org'; // Base Sepolia
      
      const web3 = new Web3(rpcUrl);

      // Get current block number
      const blockNumber = await web3.eth.getBlockNumber();

      // Get current gas price
      const gasPrice = await web3.eth.getGasPrice();

      // Get transaction count for address
      const transactionCount = await web3.eth.getTransactionCount(address!);

      setWeb3Data({
        blockNumber: Number(blockNumber),
        gasPrice: web3.utils.fromWei(gasPrice, 'gwei'),
        transactionCount : Number(transactionCount),
      });
    } catch (error) {
      console.error('Error fetching Web3 data:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Please connect wallet to view information</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-4">
      <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold">Address:</span>
          <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
            {address}
          </p>
        </div>

        <div>
          <span className="font-semibold">Balance:</span>
          <p className="text-sm">
            {balance?.formatted} {balance?.symbol}
          </p>
        </div>

        <div>
          <span className="font-semibold">Chain ID:</span>
          <p className="text-sm">{chainId} ({chainId === 8453 ? 'Base Mainnet' : 'Base Sepolia'})</p>
        </div>

        {web3Data.blockNumber && (
          <>
            <div>
              <span className="font-semibold">Current Block:</span>
              <p className="text-sm">{web3Data.blockNumber.toLocaleString()}</p>
            </div>

            <div>
              <span className="font-semibold">Gas Price:</span>
              <p className="text-sm">{web3Data.gasPrice} Gwei</p>
            </div>

            <div>
              <span className="font-semibold">Transaction Count:</span>
              <p className="text-sm">{web3Data.transactionCount}</p>
            </div>
          </>
        )}
      </div>

      <button
        onClick={fetchWeb3Data}
        className="mt-4 px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 "
      >
        Refresh Data
      </button>
    </div>
  );
}