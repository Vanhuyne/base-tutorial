// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    /// Maximum number of tokens that can ever exist
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        // Mint initial supply to the contract deployer
        _mint(initialOwner, initialSupply);
    }

    /**
     * @dev Mint new tokens (only contract owner can call this)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Minting would exceed max supply");
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens from caller's balance
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

        /**
    * @dev Airdrop tokens from the contract's balance to multiple addresses
    * @param recipients List of addresses to receive tokens
    * @param amount Amount of tokens each address will receive
    */
    function airdrop(address[] calldata recipients, uint256 amount) external onlyOwner {
        uint256 totalAmount = recipients.length * amount;
        require(balanceOf(address(this)) >= totalAmount, "Not enough tokens in contract");

        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(address(this), recipients[i], amount);
        }
    }

}
