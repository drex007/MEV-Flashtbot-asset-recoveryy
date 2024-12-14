## This is a multichain asset recovery code for compromised wallets on EVM 
# For NFT Recovery add the following to your .env file
- SPONSOR_KEY= //private key of the wallet to transfer gas fee from to the compromised wallet
- VICTIM_KEY= // private key of compromised wallet
- EVM_RPC_URL= // The chains RPC URL
- CONTRACT_ADDRESS= // contract address of the NFT
- ADDRESS_TO= // address you wish to transfer the NFT to
- TOKEN_ID= // ID of the NFT
- CHAIN_ID= //Chain ID of the Blockchain

You can change the following below for increased gas and faster transaction 
  - value: ethers.parseEther("5"),
  - maxFeePerGas: ethers.parseUnits("3", "gwei"),
  - maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
  - const FLASHBOT_URL = "https://bor.txrelay.marlin.org/" // You can change this to your choiced flashbot_url link
## How to run 
- Ensure you have nodejs an npm installed on your local machine or VPS
- run "**npm install**"
- run "**node nft-recovery.js**"



## For Token recovery, add the following to the .env file
- SPONSOR_KEY= //private key of the wallet to transfer gas fee from to the compromised wallet
- VICTIM_KEY= // private key of compromised wallet
- EVM_RPC_URL= // The chains RPC URL
- CONTRACT_ADDRESS= // contract address of the NFT
- ADDRESS_TO= // address you wish to transfer the NFT to
- CHAIN_ID= //Chain ID of the Blockchain
  
You can change the following below for increased gas and faster transaction 
  - maxFeePerGas: ethers.parseUnits("3", "gwei"),
  - maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
  - const FLASHBOT_URL = "https://bor.txrelay.marlin.org/" // You can change this to your choiced flashbot_url link'
  - const AMOUNT_OF_TOKEN_TO_TRANSFER = 100 // change this to the amount of token you wish to transfer
## How to run 
- Ensure you have nodejs an npm installed on your local machine or VPS
- run "**npm install**"
- run "**node token-recovery.js**"



 
