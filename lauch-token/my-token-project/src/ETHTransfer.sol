// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ETHTransfer is Ownable {
    event Received(address indexed from, uint256 amount);
    event Forwarded(address indexed to, uint256 amount);
    event Swept(address indexed to, uint256 amount);

    constructor() Ownable(msg.sender) {}

    // ✅ Contract có thể nhận ETH
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /// @notice Forward ETH đến 1 địa chỉ (chỉ Owner mới gọi được)
    function forward(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Not enough ETH");
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Failed to send ETH");
        emit Forwarded(to, amount);
    }

    /// @notice Owner sweep toàn bộ ETH trong contract
    function sweep(address payable to) external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "No ETH");
        (bool sent, ) = to.call{value: bal}("");
        require(sent, "Failed to sweep ETH");
        emit Swept(to, bal);
    }
}
