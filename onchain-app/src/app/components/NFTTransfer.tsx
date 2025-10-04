'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { parseAbi } from 'viem';

interface TransferFormData {
  contractAddress: string;
  tokenId: string;
  toAddress: string;
}

export function NFTTransfer() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState<TransferFormData>({
    contractAddress: '',
    tokenId: '',
    toAddress: '',
  });
  const [transferring, setTransferring] = useState(false);

  // Hook để gọi contract
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  // Hook để đợi transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // ERC721 ABI cho safeTransferFrom
  const erc721Abi = parseAbi([
    'function safeTransferFrom(address from, address to, uint256 tokenId)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function getApproved(uint256 tokenId) view returns (address)',
    'function isApprovedForAll(address owner, address operator) view returns (bool)',
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTransfer = async () => {
    if (!address || !formData.contractAddress || !formData.tokenId || !formData.toAddress) {
      alert('Please fill in all information');
      return;
    }

    // Validate addresses
    if (!formData.toAddress.startsWith('0x') || formData.toAddress.length !== 42) {
      alert('Invalid recipient address');
      return;
    }

    if (!formData.contractAddress.startsWith('0x') || formData.contractAddress.length !== 42) {
      alert('Invalid contract address');
      return;
    }

    try {
      setTransferring(true);

      // Call safeTransferFrom
      writeContract({
        address: formData.contractAddress as `0x${string}`,
        abi: erc721Abi,
        functionName: 'safeTransferFrom',
        args: [
          address as `0x${string}`,
          formData.toAddress as `0x${string}`,
          BigInt(formData.tokenId),
        ],
      });
    } catch (err: any) {
      console.error('Transfer error:', err);
      alert(`Error: ${err.message}`);
      setTransferring(false);
    }
  };

  // Reset form after successful transfer
  if (isSuccess && transferring) {
    setTimeout(() => {
      setFormData({
        contractAddress: '',
        tokenId: '',
        toAddress: '',
      });
      setTransferring(false);
      alert('NFT transfer successful! 🎉');
    }, 1000);
  }

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Please connect wallet to transfer NFT</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-6">Transfer NFT</h2>

      <div className="space-y-4 text-sm">
        {/* Contract Address */}
        <div>
          <label className="block text-xs font-semibold mb-2">
            NFT Contract Address
          </label>
          <input
            type="text"
            name="contractAddress"
            value={formData.contractAddress}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isPending || isConfirming}
          />
        </div>

        {/* Token ID */}
        <div>
          <label className="block text-xs font-semibold mb-2">
            Token ID
          </label>
          <input
            type="text"
            name="tokenId"
            value={formData.tokenId}
            onChange={handleInputChange}
            placeholder="1, 2, 3..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isPending || isConfirming}
          />
        </div>

        {/* To Address */}
        <div>
          <label className="block text-xs font-semibold mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            name="toAddress"
            value={formData.toAddress}
            onChange={handleInputChange}
            placeholder="0x..."
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isPending || isConfirming}
          />
        </div>

        {/* Current Address Info */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Your wallet:</span>
            <br />
            <span className="font-mono text-xs break-all">{address}</span>
          </p>
        </div>

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={isPending || isConfirming || !formData.contractAddress || !formData.tokenId || !formData.toAddress}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all text-sm"
        >
          {isPending && 'Waiting for confirmation...'}
          {isConfirming && 'Processing transaction...'}
          {!isPending && !isConfirming && 'Transfer NFT'}
        </button>

        {/* Status Messages */}
        {hash && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-semibold text-green-700 mb-2">
              Transaction Hash:
            </p>
            <a
              href={`https://basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-600 hover:underline break-all"
            >
              {hash}
            </a>
          </div>
        )}

        {isConfirming && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-700">
              ⏳ Waiting for transaction confirmation...
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Transfer successful!
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm font-semibold text-red-700 mb-1">
              ❌ Error:
            </p>
            <p className="text-xs text-red-600">
              {error.message}
            </p>
          </div>
        )}
      </div>

      {/* Warning */}
      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-xs text-orange-800">
          <span className="font-semibold">⚠️ Important Notice:</span>
          <br />
          • Double-check recipient address before transfer
          <br />
          • Make sure you are the owner of the NFT
          <br />
          • Transaction cannot be reversed after confirmation
          <br />
          • You will pay gas fees for the transaction
        </p>
      </div>
    </div>
  );
}