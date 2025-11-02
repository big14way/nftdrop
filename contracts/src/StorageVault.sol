// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StorageVault
 * @dev Store messages permanently on Base blockchain
 * @notice Simple on-chain message storage per wallet
 */
contract StorageVault {
    // Struct for message with timestamp
    struct Message {
        string content;
        uint256 timestamp;
    }

    // Mapping from user address to their messages
    mapping(address => string[]) public userMessages;

    // Events
    event MessageStored(address indexed user, string message, uint256 timestamp);

    /**
     * @dev Store a new message on-chain
     * @param message The message content to store
     */
    function storeMessage(string memory message) public payable {
        require(bytes(message).length > 0, "Message cannot be empty");
        require(bytes(message).length <= 280, "Message too long (max 280 characters)");

        userMessages[msg.sender].push(message);

        emit MessageStored(msg.sender, message, block.timestamp);
    }

    /**
     * @dev Get all messages for a user
     * @param user The address to query
     * @return Array of messages
     */
    function getMessages(address user) public view returns (string[] memory) {
        return userMessages[user];
    }

    /**
     * @dev Get the number of messages for a user
     * @param user The address to query
     * @return Number of messages
     */
    function getMessageCount(address user) public view returns (uint256) {
        return userMessages[user].length;
    }

    /**
     * @dev Get a specific message by index
     * @param user The address to query
     * @param index The message index
     * @return The message content
     */
    function getMessage(address user, uint256 index) public view returns (string memory) {
        require(index < userMessages[user].length, "Message index out of bounds");
        return userMessages[user][index];
    }
}
