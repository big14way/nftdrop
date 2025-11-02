// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BaseNFTDrop
 * @dev Exclusive Builder Badge NFT for Base chain
 * @notice Free mint with per-wallet limits
 */
contract BaseNFTDrop is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Constants
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MINT_LIMIT_PER_WALLET = 1;

    // Base URI for metadata
    string private _baseTokenURI;

    // Tracking mints per wallet
    mapping(address => uint256) public mintCount;

    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);

    constructor(
        string memory baseURI
    ) ERC721("Base Builder Badge", "BBB") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Mint a new NFT (free mint)
     * @param to Address to mint to
     */
    function safeMint(address to) public payable {
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(mintCount[to] < MINT_LIMIT_PER_WALLET, "Mint limit reached for this wallet");
        require(to != address(0), "Cannot mint to zero address");

        uint256 tokenId = _nextTokenId++;
        mintCount[to]++;

        _safeMint(to, tokenId);

        emit NFTMinted(to, tokenId);
    }

    /**
     * @dev Get total supply of minted NFTs
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @dev Update base URI (only owner)
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    /**
     * @dev Base URI for computing tokenURI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Returns the token URI for a given token ID
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Required override for ERC721URIStorage
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Withdraw any ETH sent to contract (only owner)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
}
