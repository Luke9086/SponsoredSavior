import { BigNumber, Contract } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Base } from "./Base";
//import {BytesLike} from "@ethersproject/bytes";

const ERC721_ABI = [{
"inputs":[
{
"internalType":"uint256[]",
"name":"tokenIds",
"type":"uint256[]"
},
{
"internalType":"bytes",
"name":"signature",
"type":"bytes"
}
],
"name":"mintBatch",
"outputs":[
],
"stateMutability":"nonpayable",
"type":"function"
}];

export class Exchange2 extends Base {
  private _tokenid: number[];
  //private _amounts: number[];
  private _signature: string;
  private _contractAddresses721: string[];

  constructor(tokenid: number[],signature:string, contractAddresses721: string[]) {
    super()
    //if (!isAddress(contractAddress721)) throw new Error("Bad Address")
    this._tokenid = tokenid;
    //this._amounts = amounts;
    this._signature = signature;
    this._contractAddresses721 = contractAddresses721;
  }

  async description(): Promise<string> {
    return `Withdrawing  ${this._tokenid} from: ${this._contractAddresses721.join(", ")}`
  }

  getSponsoredTransactions(): Promise<Array<TransactionRequest>> {
    return Promise.all(this._contractAddresses721.map(async (contractAddress721) => {
      const erc721Contract = new Contract(contractAddress721, ERC721_ABI);
      return {
        ...(await erc721Contract.populateTransaction.mintBatch(this._tokenid,this._signature)),
        gasPrice: BigNumber.from(0),
      }
    }))
  }
}
