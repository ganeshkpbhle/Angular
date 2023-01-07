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
  constructor() {
    this.enableWeb3();
    if(window.ethereum === undefined){
      alert("Non-Ethereum browser detected .Install Metamask");
    }
    else{
      window.ethereum.on('chainChanged',(Id:string)=>{
        this.chainChange.emit(Id);
      });
      window.ethereum.on('accountsChanged',(acct:Array<string>)=>{
          this.accountChange.emit(acct[0]);
      });
    }
  };
  enableWeb3=async()=>{
    await Moralis.enableWeb3({provider:'metamask'});
  }
  getNetwork= async()=>{
    const accts:Array<string>=await window.ethereum.request({ method:'eth_requestAccounts' });
    return accts;
  };
}
