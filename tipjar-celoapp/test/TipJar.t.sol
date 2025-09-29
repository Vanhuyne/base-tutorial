// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {TipJar} from "../src/TipJar.sol";

contract TipJarTest is Test {
    TipJar public tipjar;
    address owner = address(0xABCD);
    address user1 = address(0x1111);
    address user2 = address(0x2222);

    function setUp() public {
        // deploy contract với owner = address(this)
        vm.startPrank(owner);
        tipjar = new TipJar();
        vm.stopPrank();
    }

    function testInitialOwner() public {
        assertEq(tipjar.owner(), owner, "Owner should be deployer");
    }

    function testTipIncreasesBalance() public {
        vm.deal(user1, 1 ether); // nạp tiền cho user1
        vm.startPrank(user1);

        tipjar.tip{value: 0.5 ether}("Hello TipJar!");
        vm.stopPrank();

        assertEq(tipjar.getBalance(), 0.5 ether, "Contract should have 0.5 ether");
        assertEq(tipjar.tipsReceived(user1), 0.5 ether, "User1 tips not recorded");
        assertEq(tipjar.totalTips(), 0.5 ether, "Total tips not updated");
    }

    function testMultipleTips() public {
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);

        vm.prank(user1);
        tipjar.tip{value: 0.3 ether}("Tip 1");

        vm.prank(user2);
        tipjar.tip{value: 0.7 ether}("Tip 2");

        assertEq(tipjar.getBalance(), 1 ether, "Contract should have 1 ether");
        assertEq(tipjar.totalTips(), 1 ether, "Total tips incorrect");
    }

    function testWithdrawByOwner() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        tipjar.tip{value: 1 ether}("Test withdraw");

        uint256 beforeBalance = owner.balance;

        vm.prank(owner);
        tipjar.withdraw(payable(owner));

        uint256 afterBalance = owner.balance;

        assertEq(afterBalance - beforeBalance, 1 ether, "Owner should receive funds");
        assertEq(tipjar.getBalance(), 0, "Contract balance should be 0");
    }

    function test_Revert_When_NotOwnerWithdraws() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        tipjar.tip{value: 1 ether}("Testing revert");

        // kỳ vọng revert với message "Not owner"
        vm.prank(user1);
        vm.expectRevert("Not owner");
        tipjar.withdraw(payable(user1));
    }
}
