// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ETHTransfer } from "../src/ETHTransfer.sol";

contract DeployETH {
    function run() external returns (ETHTransfer) {
        // Bạn có thể truyền constructor args nếu cần đây, với Ownable(msg.sender) thì không cần args
        ETHTransfer deployed = new ETHTransfer();
        return deployed;
    }
}
