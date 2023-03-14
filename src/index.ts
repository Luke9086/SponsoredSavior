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
//import {Transfer721} from "./engine/Transfer721";
import {Claim} from "./engine/claim";
//import {Exchange2} from "./engine/exchange2";
//import {BytesLike} from "@ethersproject/bytes";
import {TransferERC20} from "./engine/TransferERC20";
require('log-timestamp');
require('dotenv').config();

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const BLOCKS_IN_FUTURE = 2;

const GWEI = BigNumber.from(10).pow(9);
const PRIORITY_GAS_PRICE = GWEI.mul(30)

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
  const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "http://127.0.0.1:8545"
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
  //const tokenid = "1";
  //const recipient = "0x61A8774a176241db17a2Ed7d8c53871B5554DDc1";
  //const address = "0x31DBf5B747025a59CbBb8A2e0a5b8C1A04773C49";
  //const engine: Base = new Transfer721(walletExecutor.address,recipient,[address],tokenid);
  //======== UNCOMMENT FOR TRANSFERING 721 DIRECTLY =========

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
    

  const account = "0xD605e095608169350CEBD2e676CBf544EF1DAEc9";
  const amounts = "248033098671156500000";
  const proof = "0x95eb4c3f022c86807b4a95f475ea573c25b66c3aadd6d193f7065d770c66eb9e0x29f75275e465f0f9be38487476657ab216f308630bd53e0cee03c0290056c3e90x848dc8c242c494bff4a16a3dd607fd161b5797f94d921a8a59bb3495de6621fe0x4ad45abd5e712e3f0f11cf859f4da3ecc720e4bc644de9ee3d2dd3fa4db8b3140x32eaff5f09c5a39f25ded688963b5ec3515b45d2ca19fae3e7d8678ec67895cf0x53c0a884cccbaa477b4745c093517c175b84f952b31b1e70b3c23990a975f75a0xe0de70f8042e5fab74ee556448e7b27875bb6e9a544dbfb614661997b4f9681e0x8c986610e34633e6de3dc9addd523e17dffdbbdaa761e9862cf5c134fa8a54510x2e0d7d24e966db5d361c263a3dbc310a00086e76a8097bbeb894b9084de678af0x92b9578529287c77f02b0e08d896ba3ccc82564cb3231eaf62a4dc3552a597110x08854c62aeb5c638e9052f322ee2eb909a6f59829307fbdaa9f79809249b31da0x64e1efed51139f368f13703eea78d2cda17119629442e25ca591b9a68df4ac080x16909433bd67066cecafcbafc55da6265eed2f03216318b311227f50cd19b7410x8951f09a98c4d192fd09c51a9b7a6710b7bbe3f0d7d435ac970e053e8c7f750d0xd37d255124e2ac95ee1289eae258e4841e4535b82c5c03b17fe3302bdb84b8eb0x77ee28608ba68039376af609486aaed06ef2fdd414d2cc859ada7d3e7a38e1a60x25126def5a159cea10a40b223000719a8fa811c66209930b3c804ccafd43e7940x1f5840248ca59a511c658f1d85c18371380d6a7957eea77c470911fa70fc014c"; 
  const proof2 =['0x95eb4c3f022c86807b4a95f475ea573c25b66c3aadd6d193f7065d770c66eb9e',
 '0x29f75275e465f0f9be38487476657ab216f308630bd53e0cee03c0290056c3e9',
 '0x848dc8c242c494bff4a16a3dd607fd161b5797f94d921a8a59bb3495de6621fe',
 '0x4ad45abd5e712e3f0f11cf859f4da3ecc720e4bc644de9ee3d2dd3fa4db8b314',
 '0x32eaff5f09c5a39f25ded688963b5ec3515b45d2ca19fae3e7d8678ec67895cf',
 '0x53c0a884cccbaa477b4745c093517c175b84f952b31b1e70b3c23990a975f75a',
 '0xe0de70f8042e5fab74ee556448e7b27875bb6e9a544dbfb614661997b4f9681e',
 '0x8c986610e34633e6de3dc9addd523e17dffdbbdaa761e9862cf5c134fa8a5451',
 '0x2e0d7d24e966db5d361c263a3dbc310a00086e76a8097bbeb894b9084de678af',
 '0x92b9578529287c77f02b0e08d896ba3ccc82564cb3231eaf62a4dc3552a59711',
 '0x08854c62aeb5c638e9052f322ee2eb909a6f59829307fbdaa9f79809249b31da',
 '0x64e1efed51139f368f13703eea78d2cda17119629442e25ca591b9a68df4ac08',
 '0x16909433bd67066cecafcbafc55da6265eed2f03216318b311227f50cd19b741',
 '0x8951f09a98c4d192fd09c51a9b7a6710b7bbe3f0d7d435ac970e053e8c7f750d',
 '0xd37d255124e2ac95ee1289eae258e4841e4535b82c5c03b17fe3302bdb84b8eb',
 '0x77ee28608ba68039376af609486aaed06ef2fdd414d2cc859ada7d3e7a38e1a6',
 '0x25126def5a159cea10a40b223000719a8fa811c66209930b3c804ccafd43e794',
 '0x1f5840248ca59a511c658f1d85c18371380d6a7957eea77c470911fa70fc014c']; 
  //const bytes = web3StringToBytes32(proof);
  const address = "0xF2d15C0A89428C9251d71A0E29b39FF1e86bce25";
  const engine: Base = new Claim(account,amounts,proof2,[address]);
  //=======UNCOMMENT FOR EXCHANGING2 =======
  const sponsoredTransactions = await engine.getSponsoredTransactions();
  console.log(sponsoredTransactions[0]);
  //sponsoredTransactions[0]['data'] = "0x3d13f874000000000000000000000000d605e095608169350cebd2e676cbf544ef1daec900000000000000000000000000000000000000000000000d7226951b11b216200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001295eb4c3f022c86807b4a95f475ea573c25b66c3aadd6d193f7065d770c66eb9e29f75275e465f0f9be38487476657ab216f308630bd53e0cee03c0290056c3e9848dc8c242c494bff4a16a3dd607fd161b5797f94d921a8a59bb3495de6621fe4ad45abd5e712e3f0f11cf859f4da3ecc720e4bc644de9ee3d2dd3fa4db8b31432eaff5f09c5a39f25ded688963b5ec3515b45d2ca19fae3e7d8678ec67895cf53c0a884cccbaa477b4745c093517c175b84f952b31b1e70b3c23990a975f75ae0de70f8042e5fab74ee556448e7b27875bb6e9a544dbfb614661997b4f9681e8c986610e34633e6de3dc9addd523e17dffdbbdaa761e9862cf5c134fa8a54512e0d7d24e966db5d361c263a3dbc310a00086e76a8097bbeb894b9084de678af92b9578529287c77f02b0e08d896ba3ccc82564cb3231eaf62a4dc3552a5971108854c62aeb5c638e9052f322ee2eb909a6f59829307fbdaa9f79809249b31da64e1efed51139f368f13703eea78d2cda17119629442e25ca591b9a68df4ac0816909433bd67066cecafcbafc55da6265eed2f03216318b311227f50cd19b7418951f09a98c4d192fd09c51a9b7a6710b7bbe3f0d7d435ac970e053e8c7f750dd37d255124e2ac95ee1289eae258e4841e4535b82c5c03b17fe3302bdb84b8eb77ee28608ba68039376af609486aaed06ef2fdd414d2cc859ada7d3e7a38e1a625126def5a159cea10a40b223000719a8fa811c66209930b3c804ccafd43e7941f5840248ca59a511c658f1d85c18371380d6a7957eea77c470911fa70fc014c";
//  console.log(sponsoredTransactions[0]);
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
