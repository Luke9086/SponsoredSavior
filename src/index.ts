import {
  FlashbotsBundleProvider, FlashbotsBundleRawTransaction,
  FlashbotsBundleResolution,
  FlashbotsBundleTransaction
} from "@flashbots/ethers-provider-bundle";
import { BigNumber, providers, Wallet,utils,Signer, VoidSigner } from "ethers";
import { Base } from "./engine/Base";
import { checkSimulation, gasPriceToGwei, printTransactions } from "./utils";
import { Approval721 } from "./engine/Approval721";
//import {WithdrawTengoku} from "./engine/remove";
import {Transfer721} from "./engine/Transfer721";
import {ClaimFLT} from "./engine/flt";
import {Mint} from "./engine/mint";
//import {Exchange2} from "./engine/exchange2";
//import {BytesLike} from "@ethersproject/bytes";
import {TransferERC20} from "./engine/TransferERC20";
require('log-timestamp');
require('dotenv').config();

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const BLOCKS_IN_FUTURE = 2;

const GWEI = BigNumber.from(10).pow(9);
const PRIORITY_GAS_PRICE = GWEI.mul(20);

const PRIVATE_KEY_EXECUTOR = process.env.PRIVATE_KEY_EXECUTOR || ""
const PRIVATE_KEY_SPONSOR = process.env.PRIVATE_KEY_SPONSOR || ""
const FLASHBOTS_RELAY_SIGNING_KEY = process.env.FLASHBOTS_RELAY_SIGNING_KEY || "";
const RECIPIENT = process.env.RECIPIENT || ""

if (PRIVATE_KEY_EXECUTOR === "") {
  console.warn("Must provide PRIVATE_KEY_EXECUTOR environment variable, corresponding to Ethereum EOA with assets to be transferred")
  process.exit(1)
}
if (PRIVATE_KEY_SPONSOR === "") {
  console.warn("Must provide PRIVATE_KEY_SPONSOR environment variable, corresponding to an Ethereum EOA with ETH to pay miner")
  process.exit(1)
}
if (FLASHBOTS_RELAY_SIGNING_KEY === "") {
  console.warn("Must provide FLASHBOTS_RELAY_SIGNING_KEY environment variable. Please see https://github.com/flashbots/pm/blob/main/guides/flashbots-alpha.md")
  process.exit(1)
}
if (RECIPIENT === "") {
  console.warn("Must provide RECIPIENT environment variable, an address which will receive assets")
  process.exit(1)
}
function web3StringToBytes32(text:string) {
        var result = utils.hexlify(utils.toUtf8Bytes(text));
        while (result.length < 66) { result += '0'; }
        if (result.length !== 66) { throw new Error("invalid web3 implicit bytes32"); }
        return result;
    }
async function main() {
  const walletRelay = new Wallet(FLASHBOTS_RELAY_SIGNING_KEY)
  //If you run the  script fot the mainnet, uncommnet the codes above
  // ======= UNCOMMENT FOR GOERLI ==========
  //const provider = new providers.InfuraProvider(5, process.env.INFURA_API_KEY || '');
  //const walletRelay = new Wallet(FLASHBOTS_RELAY_SIGNING_KEY,provider);
  //const flashbotsProvider = await FlashbotsBundleProvider.create(provider, walletRelay, 'https://relay-goerli.flashbots.net',"goerli"
  //);
  // ======= UNCOMMENT FOR GOERLI ==========

  // ======= UNCOMMENT FOR MAINNET ==========
  const ETHEREUM_RPC_URL =process.env.ETHEREUM_RPC_URL || "http://127.0.0.1:8545"
  const provider = new providers.StaticJsonRpcProvider(ETHEREUM_RPC_URL);
  //const walletRelay = new Wallet(FLASHBOTS_RELAY_SIGNING_KEY,provider);
  const flashbotsProvider = await FlashbotsBundleProvider.create(provider, walletRelay);
  //= ======= UNCOMMENT FOR MAINNET ==========

  const walletExecutor = new Wallet(PRIVATE_KEY_EXECUTOR,provider);
  const walletSponsor = new Wallet(PRIVATE_KEY_SPONSOR,provider);

  const block = await provider.getBlock("latest");

  // ======= UNCOMMENT FOR ERC20 TRANSFER ==========
  //const tokenAddress = "0xAA353eB6486b2f37A98d8EDCd75b92Dc8AaD893C";
  //const engine: Base = new TransferERC20(provider, walletExecutor.address, RECIPIENT, tokenAddress);
  // ======= UNCOMMENT FOR ERC20 TRANSFER ==========

  // ======= UNCOMMENT FOR 721 Approval ==========
  //const HASHMASKS_ADDRESS = "0x31DBf5B747025a59CbBb8A2e0a5b8C1A04773C49";
  //const engine: Base = new Approval721(RECIPIENT, [HASHMASKS_ADDRESS]);
  // ======= UNCOMMENT FOR 721 Approval ==========
  
  // ======= UNCOMMENT FOR WITHDRAW  ============
  //const tokenid = 1000;
  //const address = "0x8086c122102Bcb2d0440b11F6d875C17c80ed03C";
  //const engine: Base = new WithdrawTengoku([tokenid],[address]); 
  // ======= UNCOMMENT FOR WITHDRAW  ============

  
  //======== UNCOMMENT FOR TRANSFERING 721 DIRECTLY =========
  // const tokenid = "2054";
  // const recipient = "0xabd1d22198311f14ef7df52c18c68b85a7358d76";
  // const address = "0x20abAc3f712e31234dB222C2c0b0b192040D8Ad8";
  // const engine: Base = new Transfer721(walletExecutor.address,recipient,[address],tokenid);
  //======== UNCOMMENT FOR TRANSFERING 721 DIRECTLY =========
  //======== UNCOMMENT FOR CLAIMING FLT AND TRANSFER TO SAFE ACCOUNT
  const airdropAddress = "0x6081d7F04a8c31e929f25152d4ad37c83638C62b";
  const recipient = "";
  const engine: Base = new ClaimFLT(walletExecutor.address,recipient,airdropAddress);
  //======== UNCOMMENT FOR CLAIMING FLT AND TRANSFER TO SAFE ACCOUNT

  //=========UNCOMMENT FOR EXCHANGING =======================
  //const tokenids = [296
  //,1058
  //,4382
  //,4380
  //,4381
  //,4383];
  //const amounts = [1,1,1,1,1,1];
  //const signature = "0x52b4d2abe16f58a24fc2080d9f747458bab4d3c9e572c9fa5eaef67217c103e565e0930a9561b47dd295fe04d8aad575f91f2e797e76572b00e13800e828f3f91b";
  //const address= "0xAd5b58F10422c9EC5A75293d595E88DB73bB6D3a";
  //const engine: Base = new Exchange(tokenids,amounts,signature,[address]);
  //=========UNCOMMENT FOR EXCHANGING =======================
  //=======UNCOMMENT FOR EXCHANGING2 ======= 
// const tokenids = [1405,959,980];
 //1405,959,980
// const address = "0xafD81018461E67c0DE864E5626A800D90564587d";
// const proxyAddress = "0x7e7Ae2D57A22C5Cc0df737A6f83c64962594d39D";
 //const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
//const tokenId = "0"
// 等效于Solidity中的keccak256(abi.encodePacked(account, tokenId))
//const abicoder = new utils.AbiCoder();
//const msgHash = utils.solidityKeccak256(['uint',"address","uint256[]"],
//    [1,address,tokenids]);
//const msgHash = utils.keccak256(abicoder.encode(['uint',"address","uint256[]"],[1,address,tokenids]));
//const ethsignedHash = utils.solidityKeccak256(['string','string'],['\x19Ethereum Signed Message:\n32', msgHash]);
//const ethHash = utils.hashMessage(msgHash);
// console.log(`msgHash：${msgHash}`);
// 签名
//const messageHashBytes = utils.arrayify(msgHash);
//const signature = await walletExecutor.signMessage(messageHashBytes);
//  console.log(`signature: ${signature}`);
 // async function getSign(wallet: Signer):Promise<BytesLike>{
 //   let signer = wallet as VoidSigner;
 //   let signature = await signer.signMessage(utils.solidityKeccak256(['uint256[]'],[tokenids]));
 //   return signature;
 // }
 // const signature = getSign(walletExecutor);
    

  //const amounts = "248033098671156500000";
  //const bytes = web3StringToBytes32(proof);
  //const address = "0x00005EA00Ac477B1030CE78506496e8C2dE24bf5";
  //const engine: Base = new Mint(RECIPIENT,"1",["1"],[address]);
  //=======UNCOMMENT FOR EXCHANGING2 =======
  const sponsoredTransactions = await engine.getSponsoredTransactions();
  //console.log(sponsoredTransactions[0]);
  //console.log(sponsoredTransactions[0]);
//sponsoredTransactions[0].data="0x4300a4e6000000000000000000000000be9371326f91345777b04394448c23e2bfeaa8260000000000000000000000000000a26b00c1f0df003000390027140000faa719000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000642c5e98000000000000000000000000000000000000000000000000000000006453eb980000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000ffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000001230a49fe1eb49e761a588de4506fa93efa5f10ec16a5fdbc86c0e1ecbafdcb3bc09786912051dfc295a91fb32d38c0a2e63ae2452da37ecd81255c70606fb0406a2bb6b0f66de72dc845799f70f6fa45b9bd7b62222f2b5f3b35c4888378885c51955633574a5f9af704872f8e7fad7f8cfd9add540915e513c64259e3c8dd4918f0013fc57adc1954f0cc29674d55381f151664ca14f737a52274fe04810a820a7dc363d8d67c179a25aa56246828fdaeadab7484b642472242c4c5bafc850e38f53f1c2a23f5d54952bd35cdcf6513c5bd49975df3ad78327ee4f0d43ab65f5164073202a72d9a21d62f5ed6236819e044cc538e715fdfb0700a209e827a158055e3c53f4ce33e16f8a759897da8bf7f5c9231f67fe5d12f5d57b5c02048d3f542f2ded92b925b86e2d6642832be975c46c6a00d326078f1da9cd6d6ea1139568c6472791ce8d6490ecd506fdb914a2e32f1ca1a840f1d7e24c9effb980b5b04d7f231d363a3373cb4388003ac066f31660a05a9e45e11d5e46e04c4ab7d43402917a14d83a97c10f1b6e342c844b62f8c2ab2125059a74fe9a8fb328a5a22bc49e5c9c4bcaea98b36eb0f6faf0e9a5525a784f482805b0724f5269c396b7dee896574261645ecb6dd2ec7f44f9c86f8a082f65d0abed39ef423f5294113cdc60c0b0a9a41b6335ba9485c80b296f363ee1363f94f59f3b44a37e70236d4fef442d977cbf9a3bb240de806acca54918f091971320cb75685436bb32e2e71042e636ba7097e2ce6915708af0cb40ff8e97cb3d38a5c46d37bff108c48f413b42360c6ebe";
  const gasEstimates = await Promise.all(sponsoredTransactions.map(tx =>
    provider.estimateGas({
     ...tx,
      from: tx.from === undefined ? walletExecutor.address : tx.from
    }))
  )
  //const gasEstimates = [BigNumber.from(724684)];
  const gasEstimateTotal = gasEstimates.reduce((acc, cur) => acc.add(cur), BigNumber.from(0))

  const gasPrice = PRIORITY_GAS_PRICE.add(block.baseFeePerGas || 0);
  const bundleTransactions: Array<FlashbotsBundleTransaction | FlashbotsBundleRawTransaction> = [
    {
      transaction: {
        to: walletExecutor.address,
        gasPrice: gasPrice,
        value: gasEstimateTotal.mul(gasPrice),
        gasLimit: 21000,
	chainId:1,
      },
      signer: walletSponsor
    },
    ...sponsoredTransactions.map((transaction, txNumber) => {
      return {
        transaction: {
          ...transaction,
          gasPrice: gasPrice,
          gasLimit: gasEstimates[txNumber],
	  chainId:1,
        },
        signer: walletExecutor,
      }
    })
  ]
  const signedBundle = await flashbotsProvider.signBundle(bundleTransactions)
  await printTransactions(bundleTransactions, signedBundle);
  const simulatedGasPrice = await checkSimulation(flashbotsProvider, signedBundle);

  console.log(await engine.description())

  console.log(`Executor Account: ${walletExecutor.address}`)
  console.log(`Sponsor Account: ${walletSponsor.address}`)
  console.log(`Simulated Gas Price: ${gasPriceToGwei(simulatedGasPrice)} gwei`)
  console.log(`Gas Price: ${gasPriceToGwei(gasPrice)} gwei`)
  console.log(`Gas Used: ${gasEstimateTotal.toString()}`)

  provider.on('block', async (blockNumber) => {
    const simulatedGasPrice = await checkSimulation(flashbotsProvider, signedBundle);
    const targetBlockNumber = blockNumber + BLOCKS_IN_FUTURE;
    console.log(`Current Block Number: ${blockNumber},   Target Block Number:${targetBlockNumber},   gasPrice: ${gasPriceToGwei(simulatedGasPrice)} gwei`)
    const bundleResponse = await flashbotsProvider.sendBundle(bundleTransactions, targetBlockNumber);
    if ('error' in bundleResponse) {
      throw new Error(bundleResponse.error.message)
    }
    const bundleResolution = await bundleResponse.wait()
    if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
      console.log(`Congrats, included in ${targetBlockNumber}`)
      process.exit(0)
    } else if (bundleResolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
      console.log(`Not included in ${targetBlockNumber}`)
    } else if (bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh) {
      console.log("Nonce too high, bailing")
      process.exit(1)
    }
  })
}

main()
