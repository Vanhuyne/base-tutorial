// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/MinimalToken.sol";

contract TestTradingFee is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        
        vm.startBroadcast(privateKey);
        
        MinimalToken token = MinimalToken(contractAddress);
        
        address recipient = 0x54F5BDAcfD4834202E6A6e062601E277013e9e33;
        uint256 transferAmount = 10000 * 10**18; // 10000 tokens
        
        console.log("=== BEFORE TRANSFER ===");
        console.log("Sender balance:", token.balances(msg.sender));
        console.log("Recipient balance:", token.balances(recipient));
        console.log("Fee collector balance:", token.balances(token.feeCollector()));
        console.log("Total fees collected:", token.getTotalFeesCollected());
        
        // Tính phí trước khi transfer
        (uint256 feeAmount, uint256 actualTransfer) = token.calculateFee(msg.sender, recipient, transferAmount);
        console.log("Expected fee:", feeAmount);
        console.log("Expected transfer amount:", actualTransfer);
        
        // Thực hiện transfer
        token.transfer(recipient, transferAmount);
        
        console.log("=== AFTER TRANSFER ===");
        console.log("Sender balance:", token.balances(msg.sender));
        console.log("Recipient balance:", token.balances(recipient));
        console.log("Fee collector balance:", token.balances(token.feeCollector()));
        console.log("Total fees collected:", token.getTotalFeesCollected());
        
        console.log("=== FEE STATISTICS ===");
        console.log("Fee percentage:", token.tradingFeePercent(), "basis points");
        console.log("Fee collected this tx:", feeAmount);
        console.log("Fee collector earned:", token.getFeesEarned(token.feeCollector()));
        
        vm.stopBroadcast();
    }
}