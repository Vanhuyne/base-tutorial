// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {MyToken} from "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken public token;
    address public owner = address(0x1);
    address public user = address(0x2);
    
    uint256 constant INITIAL_SUPPLY = 100_000_000 * 10**18;
    
    function setUp() public {
        // Deploy token contract before each test
        vm.prank(owner);
        token = new MyToken("Test Token", "TEST", INITIAL_SUPPLY, owner);
    }
    
    function testInitialState() public {
        // Verify token was deployed with correct parameters
        assertEq(token.name(), "Test Token");
        assertEq(token.symbol(), "TEST");
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY);
    }
    
    function testMinting() public {
        uint256 mintAmount = 1000 * 10**18;
        
        // Only owner should be able to mint
        vm.prank(owner);
        token.mint(user, mintAmount);
        
        assertEq(token.balanceOf(user), mintAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY + mintAmount);
    }
    
    function testBurning() public {
        uint256 burnAmount = 1000 * 10**18;
        
        // Owner burns their own tokens
        vm.prank(owner);
        token.burn(burnAmount);
        
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - burnAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY - burnAmount);
    }
    
    function testFailMintExceedsMaxSupply() public {
        // This test should fail when trying to mint more than max supply
        uint256 excessiveAmount = token.MAX_SUPPLY() + 1;
        
        vm.prank(owner);
        token.mint(user, excessiveAmount);
    }
    
    function testFailUnauthorizedMinting() public {
        // This test should fail when non-owner tries to mint
        vm.prank(user);
        token.mint(user, 1000 * 10**18);
    }
}