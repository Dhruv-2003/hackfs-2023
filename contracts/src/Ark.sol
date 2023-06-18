//SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// NFT Token ID
// 0 - Rookie
// 1 - Silver
// 2 - Gold
// 3 - Diamond
// 4 - Platinum
// 5-n Counters
contract ARK is ERC1155URIStorage, Ownable {
    uint private _tokenIds = 5;

    constructor() ERC1155("") {}

    function mintGameLicense(
        string memory gameLicenseURI,
        address user
    ) public returns (uint licenseID) {
        licenseID = _tokenIds;
        _mint(user, licenseID, 1, "0x");
        _setURI(licenseID, gameLicenseURI);
        _tokenIds += 1;
    }

    function mintBadges(uint tokenId, address user) public {
        require(tokenId <= 6, "TOKENID SHOULD BE FOR BADGES ONLY");
        _mint(user, tokenId, 1, "0x");
    }

    function setBadgeURI(
        uint tokenId,
        string memory badgeURI
    ) public onlyOwner {
        require(tokenId <= 6, "TOKENID SHOULD BE FOR BADGES ONLY");
        _setURI(tokenId, badgeURI);
    }
}
