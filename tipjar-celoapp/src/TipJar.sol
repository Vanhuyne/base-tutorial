// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TipJar {
    address public owner;
    mapping(address => uint256) public tipsReceived;
    uint256 public totalTips;

    event Tipped(address indexed from, uint256 amount, string message);
    event Withdrawn(address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @notice Send a tip (native CELO). `message` is optional.
    function tip(string calldata message) external payable {
        require(msg.value > 0, "Tip must be > 0");
        tipsReceived[msg.sender] += msg.value;
        totalTips += msg.value;
        emit Tipped(msg.sender, msg.value, message);
    }

    /// @notice Owner can withdraw entire contract balance to `to`
    function withdraw(address payable to) external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "No balance");
        to.transfer(bal);
        emit Withdrawn(to, bal);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}