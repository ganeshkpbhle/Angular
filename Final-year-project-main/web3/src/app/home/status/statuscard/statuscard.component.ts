import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Contacts,StatusData } from 'src/app/Shared/data-layout';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { Moralis } from 'moralis/types';
import { CommonService } from 'src/app/Shared/services/common.service';
@Component({
  selector: 'app-statuscard',
  templateUrl: './statuscard.component.html',
  styleUrls: ['./statuscard.component.css']
})
export class StatuscardComponent implements OnInit {
  @Input() stat?:StatusData;
  @Input() trnd?:boolean;
  @Input() chainId?:number;
  @Input() sAddr?:string;
  friends:Array<Contacts>=[];
  unit:string="";
  constructor(private _moralis:MoralisService,private ngZone:NgZone,public _common:CommonService) {
    _moralis.ContactArrChange.subscribe(
      (result:Array<Contacts>)=>{
        this.friends=result;
      }
    );
  }

  ngOnInit(): void {
    this.friends=this._moralis.getCachedContacts;
    if(!this.trnd && this.stat?.senderName){
      const ind:number=this.friends.map(e=>{ return e.actualName}).indexOf(this.stat.senderName);
      this.stat.receiverName=this.friends[ind]?.name;
    }
    if(this.chainId){
      const subchain:{name:string,decimals:string,contractId:string,coll:string,desc:string,symbol:string,main:boolean}=this._common.getChainInfo(this.chainId).subchains.filter(e => e.contractId===this.stat?.tokenAddress)[0];
      this.unit=subchain?.symbol;
    }
  };
}
