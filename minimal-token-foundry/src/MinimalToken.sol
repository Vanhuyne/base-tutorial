// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error InsufficientTokens(uint256 requested, uint256 available);
error InvalidRecipient(address recipient);

contract MinimalToken {
    mapping(address => uint256) public balances;
    uint256 public totalSupply;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balances[msg.sender] = _initialSupply;
        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    /// @notice Transfer _amount tokens from msg.sender to _to
    function transfer(address _to, uint256 _amount) public returns (bool) {
        if (_to == address(0)) revert InvalidRecipient(_to);

        uint256 senderBal = balances[msg.sender];
        if (senderBal < _amount) revert InsufficientTokens(_amount, senderBal);

        unchecked { // safe because we checked senderBal >= _amount
            balances[msg.sender] = senderBal - _amount;
        }
        balances[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    /// @notice Burn tokens from msg.sender, decreasing totalSupply
    function burn(uint256 _amount) public returns (bool) {
        uint256 senderBal = balances[msg.sender];
        if (senderBal < _amount) revert InsufficientTokens(_amount, senderBal);

        unchecked {
            balances[msg.sender] = senderBal - _amount;
            totalSupply = totalSupply - _amount;
        }

        emit Burn(msg.sender, _amount);
        emit Transfer(msg.sender, address(0), _amount);
        return true;
    }
}
