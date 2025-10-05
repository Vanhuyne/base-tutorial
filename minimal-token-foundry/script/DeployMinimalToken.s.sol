// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/MinimalToken.sol";

contract DeployMinimalToken is Script {
    function run() external {
         // Đọc private key từ biến môi trường
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Bắt đầu broadcast transaction
        vm.startBroadcast(deployerPrivateKey);

        // Triển khai contract
        uint256 INITIAL_SUPPLY = 1_000_000 ether; // Define initial supply
        MinimalToken token = new MinimalToken(INITIAL_SUPPLY);

        // Log địa chỉ contract ra terminal
        console.log("MinimalToken deployed at:", address(token));
        console.log("Total Supply:", token.totalSupply());
        console.log("Deployer balance:", token.balances(msg.sender));

        // Kết thúc broadcast
        vm.stopBroadcast();
    }
}
