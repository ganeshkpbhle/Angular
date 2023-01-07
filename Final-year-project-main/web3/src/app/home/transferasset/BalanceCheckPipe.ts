import { Pipe, PipeTransform } from "@angular/core";
import Moralis from "moralis";
import { BalanceCheck, metaData } from "src/app/Shared/data-layout";
import { MoralisService } from "src/app/Shared/services/moralis.service";

@Pipe({ name: 'BalanceCheck' })
export class BalanceCheckPipe implements PipeTransform {
  userObj?:Moralis.User|null;
  currentAcct:string="";
  constructor(private _moralis: MoralisService){
    this.userObj=_moralis.getCachedUser;
    if(this.userObj!==null && this.userObj){
      this.currentAcct=this.userObj.get('ethAddress');
    }
  };
  public get chainId(): number {
    return this._moralis.chainid;
  }
  async transform(contractId:string):Promise<string> {
    const blnc: Array<BalanceCheck> = await this._moralis.getAcctBalance(this.chainId, this.currentAcct, [contractId]);
    if (blnc.length === 0) {
      const meta: Array<metaData> = await this._moralis.getTokenMeta(this.chainId, contractId);
      return new Promise<string> ((resolve)=>{
          resolve("0" +"  "+meta[0].symbol);
      });
    }
    else {
        return new Promise<string> ((resolve)=>{
            resolve(Moralis.Units.FromWei(blnc[0].balance, blnc[0].decimals) +"  "+ blnc[0].symbol);
        });
    } 
  };
}