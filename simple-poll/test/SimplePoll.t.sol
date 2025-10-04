// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/SimplePoll.sol";

contract SimplePollTest is Test {
    SimplePoll poll;
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        string [] memory opts = new string[](2);
        opts[0] = "Option A";
        opts[1] = "Option B";
        poll = new SimplePoll("Test Question?", opts);
    }

    function testVoteOnce() public {
        vm.prank(alice);
        poll.vote(0);
        assertEq(poll.votes(0), 1);
        assertEq(poll.hasVoted(alice), true);
        assertEq(poll.totalVotes(), 1);
    }

    function testCannotDoubleVote() public {
        vm.prank(alice);
        poll.vote(0);

        vm.prank(alice);
        vm.expectRevert("Already voted");
        poll.vote(1);
    }

    function testMultipleVotes() public {
        vm.prank(alice);
        poll.vote(0);

        vm.prank(bob);
        poll.vote(1);

        uint256[] memory results = poll.getVotes();
        assertEq(results[0], 1);
        assertEq(results[1], 1);
        assertEq(poll.totalVotes(), 2);
    }
}
