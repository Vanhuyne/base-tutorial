// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SimplePoll.sol";

contract DeploySimplePoll is Script {
    function run() external {
        // Lấy private key từ ENV (ví dụ: PRIVATE_KEY)
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        string[] memory opts = new string[](3);
        opts[0] = "Optimism";
        opts[1] = "Arbitrum";
        opts[2] = "Polygon";

        vm.startBroadcast(deployerKey);
        SimplePoll poll = new SimplePoll("Which L2 should we use?", opts);
        vm.stopBroadcast();

        console.log("Deployed SimplePoll at:", address(poll));
    }
}
