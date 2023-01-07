import { EventEmitter, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public opened:boolean=false;
  navExpand:EventEmitter<boolean>=new EventEmitter<boolean>();
  constructor() { 
    this.navExpand.subscribe((val:boolean)=>{this.opened=val;});
  }
  toHTML = (input: string): any => {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
  getChainInfo = (id: number): { name: string, desc: string, coll: string, subchains: Array<{ name: string, decimals: string, desc: string, contractId: string, coll: string, symbol: string, main: boolean }>,mainunit:string } => {
    let obj: { name: string, desc: string, coll: string,mainunit:string,subchains: Array<{ name: string, decimals: string, contractId: string, coll: string, desc: string, symbol: string, main: boolean }> } = { name: '', desc: 'network not found', coll: "", subchains: [],mainunit:"" };
    switch (id) {
      case 1:
        obj.name = 'ETHEREUM'; obj.desc = 'Ethereum',obj.coll="EthTransactions",obj.mainunit="ETH";
        obj.subchains = [
         // { name: "eth", contractId: "0x0000000000000000000000000000000000001010", decimals: "18", coll: "EthTransactions", desc: "Polygon", symbol: "MATIC", main: true },    
        ];
        break;
      case 137:
        obj.name = 'POLYGON'; obj.desc = 'Polygon', obj.coll = "PolygonTransactions",obj.mainunit="MATIC";
        obj.subchains = [
          { name: "polygon", contractId: "0x0000000000000000000000000000000000001010", decimals: "18", coll: "PolygonTransactions", desc: "Polygon", symbol: "MATIC", main: true },
          { name: "Chainlink", contractId: "0xb0897686c545045afc77cf20ec7a532e3120e0f1", decimals: "18", coll: "PolygonTokenTransfers", desc: "Chainlink", symbol: "LINK", main: false },
          { name: "USDT", contractId: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", decimals: "6", coll: "PolygonTokenTransfers", desc: "USDT", symbol: "USDT", main: false },
          { name: "USDC", contractId: "0x2791bca1f2de4661ed88a30C99a7a9449aa84174", decimals: "6", coll: "PolygonTokenTransfers", desc: "USDC", symbol: "USDC", main: false }
        ];
        break;
      //test
      case 80001:
        obj.name = "POLYGON", obj.desc = "Polygon Mumbai", obj.coll = "PolygonTransactions",obj.mainunit="MATIC";
        obj.subchains = [
          { name: "Chainlink", contractId: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB", decimals: "18", coll: "PolygonTokenTransfers", desc: "ChainLink", symbol: "LINK", main: false },
          { name: "DEFYN", contractId: "0xBFd123a45eD69fC9BF812F3F59ac038A92CeA340", decimals: "18", coll: "PolygonTokenTransfers", desc: "DeFyn", symbol: "DEFYN", main: false }
        ];
        break;
      case 43113:
        obj.name = 'AVAX', obj.desc = 'Avax', obj.coll = "AvaxTransactions",obj.mainunit="AVAX";
        obj.subchains = [
          { name: "Chain", contractId: "0x0b9d5d9136855f6fec3c0993fee6e9ce8a297846", decimals: "18", coll: "AvaxTransactions", desc: "Chain", symbol: "LINK", main: false },
          
        ];
        break;
      case 56:
        obj.name = 'BSC'; obj.desc = 'BNB Smart Chain', obj.coll = "BscTransactions",obj.mainunit="BNB";
        obj.subchains = [
          { name: "BNB", contractId: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", decimals: "18", coll: "BscTransactions", desc: "BNB", symbol: "BNB", main: true },
          { name: "BUSD", contractId: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", decimals: "18", coll: "BscTokenTransfers", desc: "BUSD", symbol: "BUSD", main: false },
          { name: "XRP", contractId: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE", decimals: "18", coll: "BscTokenTransfers", desc: "XRP", symbol: "XRP", main: false },
          { name: "ADA", contractId: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47", decimals: "18", coll: "BscTokenTransfers", desc: "ADA", symbol: "ADA", main: false },
          { name: "Eth", contractId: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", decimals: "18", coll: "BscTokenTransfers", desc: "Eth", symbol: "ETH", main: false },
          { name: "USDC", contractId: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: "18", coll: "BscTokenTransfers", desc: "USDC", symbol: "USDC", main: false },
          { name: "BTCB", contractId: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", decimals: "18", coll: "BscTokenTransfers", desc: "BTCB", symbol: "BTCB", main: false }
        ];
        break;
      //test
      case 97:
        obj.name = 'BSC', obj.desc = 'BNB TestNet', obj.coll = "BscTransactions",obj.mainunit="BNB";
        obj.subchains = [
          { name: "BNBTest", contractId: "0x84b9b910527ad5c03a9ca831909e21e236ea7b06", decimals: "18", coll: "BscTransactions", desc: "BNB", symbol: "TBNB", main: true },
          { name: "BUSDTest", contractId: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", decimals: "18", coll: "BscTokenTransfers", desc: "BUSD", symbol: "BUSD", main: false },
          { name: "XRPTest", contractId: "0xa83575490D7df4E2F47b7D38ef351a2722cA45b9", decimals: "18", coll: "BscTokenTransfers", desc: "XRP", symbol: "XRP", main: false },
          { name: "BTCBTest", contractId: "0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8", decimals: "18", coll: "BscTokenTransfers", desc: "BTCB", symbol: "BTCB", main: false },
          { name: "EthTest", contractId: "0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378", decimals: "18", coll: "BscTokenTransfers", desc: "Eth", symbol: "ETH", main: false },
          { name: "USDCTest", contractId: "0x64544969ed7EBf5f083679233325356EbE738930", decimals: "18", coll: "BscTokenTransfers", desc: "USDC", symbol: "USDC", main: false }
        ];
        break;
      default:
        obj.name = 'network not found'; obj.desc = 'No Network'; obj.coll = "NoCollection";
        obj.subchains = [];
        break;
    }

    return obj;
  };
  getIdFromStr=(id:string):number=>{
    return (id.indexOf('x')!==-1)?parseInt(id,16):parseInt(id)
  };
}
//const for configuration
export const category=[
  "Food & Dining","Shopping","Kids","Gifts & Donations","Other","Education","Medical"
]
export const chains:Array<{id:number,name:string,desc:string}>=[
  {id:1,name:"eth",desc:"Ethereum"},
  {id:80001,name:"POLYGON Mumbai",desc:"polygon testnet"},
  {id:137,name:"polygon",desc:"Polygon"},
  {id:43113,name:"Avax",desc:"Avax"},
  {id:56,name:"BNB Smart Chain Mainnet",desc:"BNB Smart Chain"},
  {id:97,name:"BNB Smart Chain Testnet",desc:"BNB Smart Chain TestNet"}
]
export const displayedHistory=['senderName','receiverName','units','transactionhash','tstamp']