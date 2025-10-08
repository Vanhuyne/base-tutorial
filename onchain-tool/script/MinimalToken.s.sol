// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MinimalToken} from "../src/MinimalToken.sol";

contract MinimalTokenScript is Script {
    MinimalToken public token;

    // Token configuration
    uint256 public constant INITIAL_SUPPLY = 10_000_000 * (10 ** 18); // 10 million tokens
    string public constant TOKEN_NAME = "Minimal Token";
    string public constant TOKEN_SYMBOL = "CMTK";

    function setUp() public {
        // Any setup can go here
    }

    function run() public {
        // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy token with initial configuration
        token = new MinimalToken(
            INITIAL_SUPPLY,
            TOKEN_NAME,
            TOKEN_SYMBOL
        );

        // Log deployment details
        console.log("MinimalToken deployed at:", address(token));
        console.log("Token name:", token.name());
        console.log("Token symbol:", token.symbol());
        console.log("Initial supply:", token.totalSupply() / (10 ** 18), "tokens");
        console.log("Owner:", token.owner());

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }

    // Optional helper function to deploy with custom parameters
    function runWithParams(
        uint256 initialSupply,
        string memory name,
        string memory symbol
    ) public {
        vm.startBroadcast();

        token = new MinimalToken(initialSupply, name, symbol);
        
        console.log("Custom MinimalToken deployed at:", address(token));

        vm.stopBroadcast();
    }
}