import { ethers, Wallet } from "ethers";
import { FlashbotsBundleProvider, FlashbotsBundleResolution } from "@flashbots/ethers-provider-bundle";
import { exit } from "process";
import dotenv from "dotenv"

dotenv.config()
const FLASHBOT_URL = "https://bor.txrelay.marlin.org/" //Change this flashbot relay to your choice network relay

const SPONSOR_KEY = process.env.SPONSOR_KEY
const VICTIM_KEY = process.env.VICTIM_KEY
const EVM_RPC_URL = process.env.EVM_RPC_URL
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS
const CHAIN_ID = process.env.CHAIN_ID || 137

const AMOUNT_OF_TOKEN_TO_TRANSFER = 100

const main = async () => {

    if (SPONSOR_KEY === undefined || VICTIM_KEY === undefined || EVM_RPC_URL === undefined || CONTRACT_ADDRESS === undefined || RECIPIENT_ADDRESS === undefined) {
        console.error("Please set keys SPONSOR_KEY,VICTIM_KEY, CONTRACT_ADDRESS, CHAIN_ID, RECIPIENT_ADDRESS and EVM_RPC_URL")
        exit(1)
    }

    try {
        console.log(EVM_RPC_URL, "RPC")

        //Connect to the blockchain in question using jsonrpc
        const provider = new ethers.JsonRpcProvider(EVM_RPC_URL)
        console.log(provider.getNetwork(), "PROVIDER NETWORK")
        //Create an authSigner that will sign your payloads request to establish reputation and whitelisting . This wallet doesnt sign transaction 
        const authSigner = Wallet.createRandom()
        console.log(authSigner, "\n", authSigner.privateKey)

        //Creating and instance of a flashbot provider 

        const flashbotProvider = await FlashbotsBundleProvider.create(provider, authSigner, FLASHBOT_URL)
        console.log("GOT HERE")



        const victim_connect = new Wallet(VICTIM_KEY).connect(provider)
        const sponsor_connect = new Wallet(SPONSOR_KEY).connect(provider)


        const contractABi = ["function transferFrom(address to, uint256 amount)"]

        const contractInterface = new ethers.Interface(contractABi)



        const transactions = [
            //Send TransactionFee to Victims Walley
            {
                signer: sponsor_connect,
                transaction: {
                    chainId: CHAIN_ID,
                    type: 2,
                    to: victim_connect.address,
                    value: ethers.parseEther("5"), // amount of gas to transfer
                    maxFeePerGas: ethers.parseUnits("3", "gwei"),
                    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")
                }
            },
            //Transfer token
            {
                signer: victim_connect,
                transaction: {
                    chainId: CHAIN_ID,
                    type: 2,
                    to: CONTRACT_ADDRESS,
                    gasLimit: 50000,
                    data: contractInterface.encodeFunctionData("transfer", [
                        RECIPIENT_ADDRESS,
                        AMOUNT_OF_TOKEN_TO_TRANSFER


                    ]),
                    maxFeePerGas: ethers.parseUnits("3", "gwei"),
                    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei")


                }
            },



        ]



        //
        provider.on("block", async (blockNumber) => {

            console.log("Block Number ================>", blockNumber);
            const targetBlockNumber = blockNumber + 1;
            const response = await flashbotProvider.sendBundle(transactions, targetBlockNumber)


            if ("error" in response) {
                console.log("ERROR IN RESPONSE", response.error.message);
                return;
            }

            const resolution = await response.wait();



            if (resolution === FlashbotsBundleResolution.BundleIncluded) {
                console.log("congrats, included in targetBlockNumber ============>", targetBlockNumber)
                exit(0)
            } else if (resolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
                console.log("Transaction not included in targetBlockNumber ============>", targetBlockNumber)

            } else if (resolution === FlashbotsBundleResolution.AccountNonceTooHigh) {
                console.log("Acoount Ounce too high")
                exit(1)
            }


        })

    } catch (error) {
        console.error("error ===========>", error.message)

    }
}


main()