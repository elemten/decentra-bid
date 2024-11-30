// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract DecentraBid {
    struct Auction {
        string name;               // Auction name
        string details;            // Auction details
        string imageUrl;
        address payable creator;
        uint256 startingBid;
        uint256 highestBid;
        address payable highestBidder;
        uint256 endTime;
        bool finalized;
        bool active;
        address nftContract;       // Address of the NFT contract
        uint256 nftTokenId;        // NFT token ID
    }
    struct AuctionView {
    string name;
    string details;
    string imageUrl;
    address creator;
    uint256 startingBid;
    uint256 highestBid;
    address highestBidder;
    uint256 endTime;
    bool finalized;
    bool active;
    address nftContract;
    uint256 nftTokenId;
}


    struct Bidder {
        address bidderAddress;
        uint256 bidAmount;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => Bidder[3]) public topBidders;  // Mapping to store top 3 bidders for each auction
    uint256 public auctionCount = 0;
    uint256 public bidTimeExtension = 15 minutes; // 15 minutes in seconds

    // Event declarations
    event AuctionCreated(uint256 auctionId, string name, address creator, uint256 startingBid, uint256 endTime, address nftContract, uint256 nftTokenId);
    event BidPlaced(uint256 auctionId, address bidder, uint256 amount);
    event AuctionFinalized(uint256 auctionId, address winner, uint256 winningBid);

    // Function to create an auction with an NFT, name, details, and features
    function createAuction(
        address _nftContract, 
        uint256 _nftTokenId, 
        string memory _name, 
        string memory _details, 
        string memory _imageUrl,
        uint256 _startingBid, 
        uint256 _duration
       
    ) external {
        require(_startingBid > 0, "Starting bid must be greater than zero.");
        require(_duration > 0, "Duration must be greater than zero.");

        // Transfer NFT to the contract
        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_nftTokenId) == msg.sender, "You do not own this NFT.");
        nft.transferFrom(msg.sender, address(this), _nftTokenId);
        auctionCount++;
        uint256 auctionId = auctionCount;

        // Create new auction and set its values
        Auction storage auction = auctions[auctionId];
        auction.name = _name;
        auction.details = _details;
        auction.imageUrl= _imageUrl;
        auction.creator = payable(msg.sender);
        auction.startingBid = _startingBid;
        auction.highestBid = 0;
        auction.highestBidder = payable(address(0));
        auction.endTime =  _duration;
        auction.finalized = false;
        auction.active = true;
        auction.nftContract = _nftContract;
        auction.nftTokenId = _nftTokenId;

       

        // emit AuctionCreated(auctionId, _name, msg.sender, _startingBid, block.timestamp + _duration, _nftContract, _nftTokenId);
    }

    // Function to place a bid
    function placeBid(uint256 _auctionId) external payable {
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp < auction.endTime, "Auction has already ended.");
        require(auction.active, "Auction is not active.");
        require(msg.value > auction.startingBid, "Bid must be higher than starting bid.");
        require(msg.value > auction.highestBid, "Bid must be higher than the current highest bid.");

        // Refund the previous highest bidder
        if (auction.highestBidder != address(0)) {
            auction.highestBidder.transfer(auction.highestBid);
        }

        // Update the highest bid
        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        // Check if remaining time is less than 15 minutes, then extend auction end time
    if (auction.endTime - block.timestamp < 15 minutes) {
        auction.endTime += bidTimeExtension;
    }

        // Update top 3 bidders
        updateTopBidders(_auctionId, msg.sender, msg.value);

        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }

    // Function to update the top 3 bidders
    function updateTopBidders(uint256 _auctionId, address _bidder, uint256 _bidAmount) internal {
        Bidder[3] storage bidders = topBidders[_auctionId];

        for (uint256 i = 0; i < 3; i++) {
            if (bidders[i].bidAmount < _bidAmount) {
                // Shift the lower-ranked bidders down
                for (uint256 j = 2; j > i; j--) {
                    bidders[j] = bidders[j - 1];
                }
                bidders[i] = Bidder(_bidder, _bidAmount);
                break;
            }
        }
    }

    // Function to finalize the auction
    function finalizeAuction(uint256 _auctionId) external {
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp >= auction.endTime, "Auction is not yet ended.");
        require(!auction.finalized, "Auction already finalized.");
        require(auction.creator == msg.sender || auction.highestBidder == msg.sender, "Only the creator or highest bidder can finalize.");

        auction.finalized = true;
        auction.active = false;

        // Transfer the highest bid to the creator
        if (auction.highestBidder != address(0)) {
            auction.creator.transfer(auction.highestBid);

            // Transfer NFT to the highest bidder
            IERC721 nft = IERC721(auction.nftContract);
            nft.transferFrom(address(this), auction.highestBidder, auction.nftTokenId);
        } else {
            // If no bids were placed, return the NFT to the auction creator
            IERC721 nft = IERC721(auction.nftContract);
            nft.transferFrom(address(this), auction.creator, auction.nftTokenId);
        }

        emit AuctionFinalized(_auctionId, auction.highestBidder, auction.highestBid);
    }

    // View function to get auction details
    function getAuction(uint256 _auctionId) external view returns (AuctionView memory) {
    Auction storage auction = auctions[_auctionId];
    return AuctionView(
        auction.name,
        auction.details,
        auction.imageUrl,
        auction.creator,
        auction.startingBid,
        auction.highestBid,
        auction.highestBidder,
        auction.endTime,
        auction.finalized,
        auction.active,
        auction.nftContract,
        auction.nftTokenId
    );
}


    // View function to get top 3 bidders for an auction
    function getTopBidders(uint256 _auctionId) external view returns (Bidder[3] memory) {
        return topBidders[_auctionId];
    }
}