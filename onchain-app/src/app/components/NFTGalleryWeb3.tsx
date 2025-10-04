'use client';

import { useAccount, useChainId } from 'wagmi';
import { useState } from 'react';
import Web3 from 'web3';

interface NFT {
  tokenId: string;
  name?: string;
  image?: string;
  contractAddress: string;
  tokenURI?: string;
}

export function NFTGalleryWeb3() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState('');

  // ERC721 ABI minimal
  const ERC721_ABI = [
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_owner', type: 'address' }, { name: '_index', type: 'uint256' }],
      name: 'tokenOfOwnerByIndex',
      outputs: [{ name: '', type: 'uint256' }],
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ name: '', type: 'string' }],
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [{ name: '', type: 'string' }],
      type: 'function',
    },
  ];

  const fetchNFTsFromContract = async () => {
    if (!address || !contractAddress) {
      alert('Please enter NFT contract address');
      return;
    }

    setLoading(true);

    try {
      const rpcUrl = chainId === 8453 
        ? 'https://mainnet.base.org'
        : 'https://sepolia.base.org';

      const web3 = new Web3(rpcUrl);
      const contract = new web3.eth.Contract(ERC721_ABI, contractAddress);

      // Get number of NFTs
      const balance = await contract.methods.balanceOf(address).call();
      const nftCount = Number(balance);

      const nftList: NFT[] = [];

      // Get each token ID
      for (let i = 0; i < nftCount && i < 20; i++) { // Limit to 20 NFTs to avoid overload
        try {
          const tokenId = await contract.methods.tokenOfOwnerByIndex(address, i).call() as string;
          const tokenURI = await contract.methods.tokenURI(tokenId).call() as string | undefined;

          // Fetch metadata từ tokenURI
          let metadata: any = {};
          let tokenUriString = typeof tokenURI === 'string' ? tokenURI : '';
          if (tokenUriString) {
            const uri = tokenUriString.replace('ipfs://', 'https://ipfs.io/ipfs/');
            try {
              const response = await fetch(uri);
              metadata = await response.json();
            } catch (e) {
              console.error('Error fetching metadata:', e);
            }
          }

          nftList.push({
            tokenId: tokenId,
            name: metadata.name || `Token #${tokenId}`,
            image: metadata.image?.replace('ipfs://', 'https://ipfs.io/ipfs/'),
            contractAddress,
            tokenURI: tokenUriString,
          });
        } catch (error) {
          console.error(`Error fetching token at index ${i}:`, error);
        }
      }

      setNfts(nftList);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      alert('Error fetching NFTs. Contract may not support ERC721Enumerable.');
    }

    setLoading(false);
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Please connect wallet to view NFTs</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 border border-gray-200 rounded-lg p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">NFT Gallery (Web3.js)</h2>
        
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter NFT contract address (0x...)"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            onClick={fetchNFTsFromContract}
            disabled={loading}
            className="w-full px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Find NFTs'}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Note: Contract must support ERC721Enumerable interface
        </p>
      </div>

      {nfts.length > 0 && (
        <div className="space-y-4">
          {nfts.map((nft, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex">
                {nft.image && (
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-200">
                    <img
                      src={nft.image}
                      alt={nft.name || 'NFT'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-lg">{nft.name}</h3>
                  <p className="text-sm text-gray-500">Token ID: {nft.tokenId}</p>
                  {nft.tokenURI && (
                    <a
                      href={nft.tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline block mt-2"
                    >
                      View Metadata
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}