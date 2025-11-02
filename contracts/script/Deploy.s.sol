// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/BaseNFTDrop.sol";
import "../src/StorageVault.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy BaseNFTDrop
        BaseNFTDrop nftDrop = new BaseNFTDrop("ipfs://QmSample123/");
        console.log("BaseNFTDrop deployed at:", address(nftDrop));

        // Deploy StorageVault
        StorageVault vault = new StorageVault();
        console.log("StorageVault deployed at:", address(vault));

        vm.stopBroadcast();
    }
}
