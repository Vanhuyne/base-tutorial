// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/MinimalToken.sol";

contract DeployTradingFeeToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Thông số token với trading fee
        string memory name = "TradingFee Token";
        string memory symbol = "TFEE";
        uint8 decimals = 18;
        uint256 initialSupply = 1_000_000 * 10**decimals; // 1 triệu token
        uint256 tradingFeePercent = 200; // 2% phí giao dịch (200 basis points)

        // Deploy contract với trading fee
        MinimalToken token = new MinimalToken(
            name,
            symbol,
            decimals,
            initialSupply,
            tradingFeePercent
        );

        console.log("==== TRADING FEE TOKEN DEPLOYED ====");
        console.log("Contract Address:", address(token));
        console.log("Token Name:", token.name());
        console.log("Token Symbol:", token.symbol());
        console.log("Total Supply:", token.totalSupply());
        console.log("Trading Fee:", token.tradingFeePercent(), "basis points");
        console.log("Fee Collector:", token.feeCollector());
        console.log("Deployer Balance:", token.balances(msg.sender));
        console.log("====================================");

        vm.stopBroadcast();
    }
}