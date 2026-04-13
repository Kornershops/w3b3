// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title W3B3SubDAO
 * @dev Facilitates granular governance for specific chains or specific logic modules
 * allowing the overarching DAO to decentralize operations securely.
 */
contract W3B3SubDAO is Ownable, ReentrancyGuard {
    IERC20 public governanceToken; // The localized voting token or core W3B3 token mapped

    uint256 public minimumQuorum = 100000 * 1e18; // 100k token quorum
    uint256 public votingDuration = 3 days;

    struct Proposal {
        uint256 id;
        string description;
        address targetContract;
        bytes callData;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
    }

    uint256 public nextProposalId;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 id, string description, address targetContract);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 id);

    constructor(address _governanceToken, address initialOwner) Ownable(initialOwner) {
        require(_governanceToken != address(0), "Invalid token address");
        governanceToken = IERC20(_governanceToken);
    }

    /**
     * @dev Creates a binding on-chain action proposal for this specific sub-dao module.
     */
    function createProposal(string calldata _description, address _targetContract, bytes calldata _callData) external returns (uint256) {
        // Normally requires some minimum threshold of holdings to propose.
        // Simplified for Phase 9 demo.

        uint256 pid = nextProposalId++;
        
        proposals[pid] = Proposal({
            id: pid,
            description: _description,
            targetContract: _targetContract,
            callData: _callData,
            votesFor: 0,
            votesAgainst: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + votingDuration,
            executed: false
        });

        emit ProposalCreated(pid, _description, _targetContract);
        return pid;
    }

    /**
     * @dev Cast a vote on a proposal. 1 token = 1 vote.
     */
    function vote(uint256 proposalId, bool support) external nonReentrant {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.startTime, "Voting has not started");
        require(block.timestamp <= p.endTime, "Voting has ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 voterWeight = governanceToken.balanceOf(msg.sender);
        require(voterWeight > 0, "No voting weight");

        hasVoted[proposalId][msg.sender] = true;

        if (support) {
            p.votesFor += voterWeight;
        } else {
            p.votesAgainst += voterWeight;
        }

        emit Voted(proposalId, msg.sender, support, voterWeight);
    }

    /**
     * @dev Executes a successful proposal if the quorum is met and the time has expired.
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp > p.endTime, "Voting is still active");
        require(!p.executed, "Already executed");
        require(p.votesFor + p.votesAgainst >= minimumQuorum, "Quorum not met");
        require(p.votesFor > p.votesAgainst, "Proposal defeated");

        p.executed = true;

        // Perform the sub-dao arbitrary function execution securely
        (bool success, ) = p.targetContract.call(p.callData);
        require(success, "Proposal Execution failed by target");

        emit ProposalExecuted(proposalId);
    }
}
