import { EventEmitter, Injectable } from '@angular/core';
import Moralis from 'moralis';
import Web3 from 'web3';
declare let window: any;
@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  ethEnabled:boolean=false;
  chainChange:EventEmitter<string>=new EventEmitter<string>();
  accountChange:EventEmitter<string>=new EventEmitter<string>();
  private chainId:number=-1;
  
  public get currChain() : number {
    return this.chainId;
  }
  
  constructor() {
    this.enableWeb3();
    if(window.ethereum === undefined){
      alert("Non-Ethereum browser detected .Install Metamask");
    }
    else{
      window.ethereum.on('chainChanged',(Id:string)=>{
        console.log(Id);
        this.chainChange.emit(Id);
      });
      window.ethereum.on('accountsChanged',(acct:Array<string>)=>{
          this.accountChange.emit(acct[0]);
      });
      this.getNetwork().then(
        (chain:number)=>{
          this.chainId=chain;
        }
      );
    }
  };
  enableWeb3=async()=>{
    await Moralis.enableWeb3({provider:'metamask'});
  }
  getEthAccounts= async()=>{
    const accts:Array<string>=await window.ethereum.request({ method:'eth_requestAccounts' });
    return accts;
  };
  getNetwork=async()=>{
    const Id = await window.ethereum.networkVersion;
    if(typeof Id==='string' && Id!==null && Id){
      return parseInt(Id);
    }
    else{
      return -1;
    }
  };
}
