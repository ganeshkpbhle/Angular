import { Component, Input, NgZone, OnInit } from '@angular/core';
import { GeneralCount } from 'src/app/Shared/data-layout';
import { CommonService } from 'src/app/Shared/services/common.service';

@Component({
  selector: 'app-numcard',
  templateUrl: './numcard.component.html',
  styleUrls: ['./numcard.component.css']
})
export class NumcardComponent implements OnInit {
  @Input() card_ent?:GeneralCount;
  symbol:string="";
  theme:string="";
  name:string="";
  constructor(private _common:CommonService,private ngzone:NgZone) { 
  }
  ngOnInit(): void {
    this.ngzone.run(
      ()=>{
        if(this.card_ent){
          const info=this._common.getChainInfo(parseInt(this.card_ent.name));
          this.name=info.name;
          
        }
      }
    );
  }
}
