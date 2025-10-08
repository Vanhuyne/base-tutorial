// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MinimalToken
 * @dev Implementation of the ERC20 Token Standard.
 * This token includes:
 * - Standard ERC20 functionality
 * - Ability to mint new tokens (onlyOwner)
 * - Ability to burn tokens (onlyOwner)
 * - Initial supply minted to the deployer
 */
contract MinimalToken is ERC20, Ownable {
    // Token decimals (standard is 18 for most ERC20 tokens)
    uint8 private constant _decimals = 18;
    
    // Maximum token supply (100 million tokens)
    uint256 public constant MAX_SUPPLY = 100_000_000 * (10 ** 18);
    
    /**
     * @dev Constructor that gives the msg.sender all of the initial supply.
     * @param initialSupply The amount of tokens to mint on deployment
     * @param name The name of the token
     * @param symbol The symbol of the token
     */
    constructor(
        uint256 initialSupply,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds maximum supply");
        
        // Mint initial supply to the deployer
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Creates `amount` tokens and assigns them to `to`.
     * Can only be called by the current owner.
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Mint would exceed maximum supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Returns the number of decimals used for the token.
     */
    function decimals() public pure override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Burns a specific amount of tokens.
     * Only the contract owner can call this function.
     * @param amount The amount of tokens to burn from the owner's account
     * @return A boolean that indicates if the operation was successful
     */
    function burn(uint256 amount) public onlyOwner returns (bool) {
        _burn(owner(), amount);
        return true;
    }
    
    /**
     * @dev Burns tokens from a specific account.
     * Only the contract owner can call this function.
     * @param account The address to burn tokens from
     * @param amount The amount of tokens to burn
     * @return A boolean that indicates if the operation was successful
     */
    function burnFrom(address account, uint256 amount) public onlyOwner returns (bool) {
        _burn(account, amount);
        return true;
    }
    
    /**
     * @dev Transfers tokens to a specified address.
     * This function provides a more explicit interface over the inherited transfer function.
     * @param recipient The address to transfer tokens to
     * @param amount The amount of tokens to transfer
     * @return A boolean that indicates if the operation was successful
     */
    function transferTokens(address recipient, uint256 amount) public returns (bool) {
        require(recipient != address(0), "Transfer to the zero address not allowed");
        require(amount > 0, "Transfer amount must be greater than zero");
        
        _transfer(_msgSender(), recipient, amount);
        return true;
    }
    
    /**
     * @dev Bulk transfers tokens to multiple addresses at once.
     * This is a gas-efficient way to distribute tokens to many recipients.
     * @param recipients An array of addresses to transfer tokens to
     * @param amounts An array of amounts to transfer to each recipient
     * @return A boolean that indicates if all operations were successful
     */
    // function bulkTransfer(address[] calldata recipients, uint256[] calldata amounts) public returns (bool) {
    //     require(recipients.length == amounts.length, "Recipients and amounts arrays must have the same length");
        
    //     for (uint256 i = 0; i < recipients.length; i++) {
    //         require(recipients[i] != address(0), "Transfer to the zero address not allowed");
    //         require(amounts[i] > 0, "Transfer amount must be greater than zero");
            
    //         _transfer(_msgSender(), recipients[i], amounts[i]);
    //     }
        
    //     return true;
    // }
}
