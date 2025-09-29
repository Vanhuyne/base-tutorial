// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import chuẩn từ forge-std
import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";

// Import contract TipJar
import {TipJar} from "../src/TipJar.sol";

contract Deploy is Script {
    function run() external {
        // Lấy private key từ ENV (config trong .env)
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Bắt đầu broadcast -> transaction sẽ gửi lên network
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TipJar
        TipJar tipjar = new TipJar();

        // Log địa chỉ contract để kiểm tra sau deploy
        console2.log(" TipJar deployed at:", address(tipjar));
        vm.stopBroadcast();
    }
}
