// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimplePoll {
    string public question;
    string[] public options;
    mapping(uint256 => uint256) public votes;
    mapping(address => bool) public hasVoted;
    uint256 public totalVotes;

    event VoteCast(address indexed voter, uint256 indexed optionIndex);

    constructor(string memory _question, string[] memory _options) {
        require(_options.length >= 2, "At least 2 options required");
        question = _question;
        for (uint i = 0; i < _options.length; i++) {
            options.push(_options[i]);
        }
    }

    function vote(uint256 _optionIndex) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(_optionIndex < options.length, "Invalid option");
        votes[_optionIndex] += 1;
        hasVoted[msg.sender] = true;
        totalVotes += 1;
        emit VoteCast(msg.sender, _optionIndex);
    }

    function getOptions() external view returns (string[] memory) {
        return options;
    }

    function getVotes() external view returns (uint256[] memory) {
        uint256[] memory _votes = new uint256[](options.length);
        for (uint i = 0; i < options.length; i++) {
            _votes[i] = votes[i];
        }
        return _votes;
    }
}
