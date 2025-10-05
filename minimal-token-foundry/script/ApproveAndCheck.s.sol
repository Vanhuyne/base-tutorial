// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/MinimalToken.sol";

contract ApproveAndCheck is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        
        vm.startBroadcast(privateKey);
        
        MinimalToken token = MinimalToken(contractAddress);
        
        address owner = msg.sender;
        address spender = 0x54F5BDAcfD4834202E6A6e062601E277013e9e33;
        uint256 approveAmount = 1000 * 10**18; // 2000 tokens
        
        console.log("=== BEFORE APPROVE ===");
        console.log("Owner:", owner);
        console.log("Spender:", spender);
        console.log("Current allowance:", token.allowance(owner, spender));
        
        // Thực hiện approve
        console.log("Approving", approveAmount, "tokens...");
        token.approve(spender, approveAmount);
        
        console.log("=== AFTER APPROVE ===");
        uint256 newAllowance = token.allowance(owner, spender);
        console.log("New allowance:", newAllowance);
        
        // Verify approve thành công
        if (newAllowance == approveAmount) {
            console.log("APPROVE SUCCESSFUL!");
            console.log("Spender can now spend up to", newAllowance, "tokens");
        } else {
            console.log("APPROVE FAILED!");
            console.log("Expected:", approveAmount);
            console.log("Actual:", newAllowance);
        }
        
        vm.stopBroadcast();
    }
}