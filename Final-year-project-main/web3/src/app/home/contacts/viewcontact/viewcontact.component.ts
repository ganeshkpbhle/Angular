import { Component, Inject, NgZone, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contacts } from 'src/app/Shared/data-layout';
import { environment } from 'src/environments/environment';
import { EventEmitter } from '@angular/core';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
@Component({
  selector: 'app-viewcontact',
  templateUrl: './viewcontact.component.html',
  styleUrls: ['./viewcontact.component.css']
})
export class ViewcontactComponent implements OnInit {
  card:Contacts;
  dpUrl:string=environment.dicebear;
  blockStats:boolean=false;
  blockChange:EventEmitter<{flg:boolean,id:string}>=new EventEmitter<{flg:boolean,id:string}>();
  constructor(private dialogRef: MatDialogRef<ViewcontactComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,private ngzone:NgZone,private _moralis:MoralisService) { 
        this.card=data.card;
    _moralis.ContactArrChange.subscribe(
      (result:Array<Contacts>)=>{
        const temp=result.find(e => e.contactId===this.card.contactId);
        this.ngzone.run(()=>{
          if(temp){
            this.card.block=temp.block;
            this.blockStats=false;
          }
        });
      }
    );
    }
  ngOnInit(): void {
  }
  setBlock=(flg:boolean)=>{
    this.ngzone.run(()=>{
      this.blockStats=true;
      this.blockChange.emit({flg,id:this.card.contactId});
      this.card.block=flg;
    });
  }
}
