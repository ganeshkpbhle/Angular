import { Component, Input, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Moralis from 'moralis';
import { SignInType } from 'src/app/Shared/data-layout';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { AlertComponent } from './alert/alert.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { Web3Service } from 'src/app/Shared/services/web3.service';
import { CommonService } from 'src/app/Shared/services/common.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() userObj?: Moralis.User | null;
  public btnText: string = "Loading ..";
  get buttontxt(): string {
    return this.btnText
  }
  //btnWalletlogo:HTMLImageElement=new HTMLImageElement();
  flag: boolean = false;
  signTyp?: SignInType;
  SideElements: any = [
    {
      title: "DashBoard",
      path: 'dash',
      cName: 'd-inline-flex flex-row',
      iconactive: "fa-solid fa-chart-line px-3 icon-active",
      iconinactive: "fa-solid fa-chart-line fa-1x px-3 icon-inactive",
      active: "active"
    },
    {
      title: "Transfer",
      path: 'transfer',
      cName: 'd-inline-flex flex-row',
      iconactive: "fa-solid fa-arrow-right-arrow-left fa-1x px-3 icon-active",
      iconinactive: "fa-solid fa-arrow-right-arrow-left fa-1x px-3 icon-inactive",
      active: "active"
    },
    {
      title: "History",
      path: 'history',
      cName: 'd-inline-flex flex-row',
      iconactive: "fa-solid fa-file-invoice-dollar fa-1x px-3 icon-active",
      iconinactive: "fa-solid fa-file-invoice-dollar fa-1x px-3 icon-inactive",
      active: "active"
    },
    {
      title: "Stats",
      path: 'stats',
      cName: 'd-inline-flex flex-row',
      iconactive: "fa-solid fa-bars-progress fa-1x px-3 icon-active",
      iconinactive: "fa-solid fa-bars-progress fa-1x px-3 icon-inactive",
      active: "active"
    },
    {
      title: "Friends",
      path: 'friends',
      cName: 'd-inline-flex flex-row',
      iconactive: "fa-solid fa-address-book fa-1x px-3 icon-active",
      iconinactive: "fa-solid fa-address-book fa-1x px-3 icon-inactive",
      active: "active"
    }
  ];
  constructor(private _moralis: MoralisService, private dialog: MatDialog,private _web3:Web3Service,private ngzone:NgZone,private _common:CommonService) {
    this._web3.accountChange.subscribe(
      (acct: string) => {
        ngzone.run(()=>{
          if(this.userObj){
            this.btnText = '<i class="fa-solid fa-wallet fa-1x icon-active"></i> ' + acct.substring(0,10);
          }
        });
      }
    );
    this._moralis.SessionObjectChange.subscribe(
      (obj: Moralis.User) => {
        this.userObj = obj;
        this.InitProcess(obj);
      }
    );
  }
  ngOnInit(): void {
    this.userObj = this._moralis.getCachedUser;
    this.InitProcess(this.userObj);
  }
  connectWallet = () => {
    if (!this.flag) {
      let dialogRef: MatDialogRef<ConfirmationComponent> = this.dialog.open(ConfirmationComponent, {
        width: "100%",
        height: "50%",
        disableClose: true,
        data: {
          obj: this.userObj,
        }
      });
      dialogRef.componentInstance.emitConnected.subscribe(
        (acct: string) => {
          this.btnText = acct.substring(0, 10);
          this.flag = true;
        }
      );
      dialogRef.componentInstance.emitAlert.subscribe(
        (acct: string) => {
          this.dialog.open(AlertComponent, {
            width: "50%",
            height: "50%",
            disableClose: false,
            data: { acct }
          });
        }
      );
    }
  };
  InitProcess = (obj: Moralis.User | undefined | null) => {
    if (obj && obj !== null) {
      this._moralis.getType(obj.getSessionToken())
        .then(
          (type: SignInType) => {
            this.signTyp = type;
            if (type.signInType) {
              if (type.signInType === "email/pass") {
                this.btnText = "Connect Wallet";
              }
              else {
                this.btnText = '<i class="fa-solid fa-wallet fa-1x icon-active"></i> ' + obj.get("ethAddress").substring(0, 10);
                this.flag = true;
              }
            }
          }
        );
    }
  };
}
