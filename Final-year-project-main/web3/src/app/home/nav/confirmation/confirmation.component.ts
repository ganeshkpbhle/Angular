import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Moralis from 'moralis/types';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { Web3Service } from 'src/app/Shared/services/web3.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  userObj?: Moralis.User | null;
  userName:string|undefined;
  availAccts: Array<string> = [];
  cachedAddr: Array<string>=[];
  @Output() emitConnected: EventEmitter<string> = new EventEmitter<string>();
  @Output() emitAlert:EventEmitter<string>=new EventEmitter<string>();
  constructor(private _moralis: MoralisService, private _web3: Web3Service, @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    , private dialogRef: MatDialogRef<ConfirmationComponent>) {
    this.userObj = data?.obj;
    this.cachedAddr=this.userObj?.get("accounts");
    this.userName=this.userObj?.getUsername();
    _web3.getEthAccounts().then(
      (addrs: string[]) => {
        this.availAccts = addrs;
      }
    );
  }

  ngOnInit(): void {
  }
  proceed = () => {
    if(this.availAccts){
      if (this.cachedAddr.includes(this.availAccts[0])) {
        this._moralis.connectExternally().then(
          () => {
            this._moralis.setType("e/p+wallet")
              .then(
                () => {
                  this.userObj = this._moralis.getCachedUser;
                  this.emitConnected.emit(this.availAccts[0]);
                  this.Close();
                }
              );
          }
        );
      }
      else{
        this.emitAlert.emit();
        this.Close();
      }
    }
  };
  Close = () => {
    this.dialogRef.close();
  };
}
