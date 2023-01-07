import { ArrayType } from '@angular/compiler';
import { Component, Inject, NgZone, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Moralis from 'moralis/types';
import { AcctFill, Contacts, InvitesData, _ConfirmInvite, _FetchFriendType } from 'src/app/Shared/data-layout';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { ConfirmInviteComponent } from './confirm-invite/confirm-invite.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  invites: InvitesData;
  userObj: Moralis.User;
  userAccts: Array<string> = [];
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, private _moralis: MoralisService
    , private dialog: MatDialog,private ngzone:NgZone) {
    this.invites = data.invites;
    this.userObj = data.user;
    this.userAccts = this.userObj.get("accounts");
  }

  ngOnInit(): void {
    this.ngzone.run(()=>{
      this._moralis.InvitesChange.subscribe(
        (obj: InvitesData) => {
          this.invites = obj;
        }
      );
    });
  }
  accept = (index: number) => {
    const accts: Array<AcctFill> = [];
    this._moralis.fetchFriends({ fromname: this.invites.reqs[index].get('userName'), name: this.invites.reqs[index].get('friendName') })
      .then(
        (response: _FetchFriendType) => {
          if (response.friendEnt.length === 0) {
            console.log(response);
            this.userAccts.forEach((e: string, index: number) => {
              accts.push({ acct: e, value: index, selected: false });
            });
          }
          else {
            const linked: Array<number> = response.friendEnt.map((e) => {
              return this.userAccts.indexOf(e.addr);
            });
            this.userAccts.forEach((e: string, index: number) => {
              if (linked.includes(index)) {
                accts.push({ acct: e, value: index, selected: true });
              }
              else {
                accts.push({ acct: e, value: index, selected: false });
              }
            });
          }
          let dialogRef = this.dialog.open(ConfirmInviteComponent, {
            width: "60%",
            height: "40%",
            disableClose: true,
            data: {
              accts,
              name: response.user?.get('friendName')
            }
          });
          dialogRef.componentInstance.res.subscribe(
            (formResult: _ConfirmInvite) => {
              if (response.friendEnt.length === 0) {
                this._moralis.acceptInvite({ id: this.invites.reqs[index].id, accts: formResult.selectedAccts, fnick: formResult.fnick })
                  .then(
                    (result) => {
                      this.invites.reqs = this.invites.reqs.filter((e, i) => { return i !== index });
                      this._moralis.fetchContacts().then((result:Array<Contacts>)=>{this._moralis.ContactArrChange.emit()});
                    }
                  );
              }
              else {
                const userAccts: Array<string> = response.userEnt.map((e) => {
                  return e.addr;
                });
                let uacct: string = "";
                if (userAccts.includes(this.invites.reqs[index].get('fromAddr'))) {
                  this._moralis.editAcct(
                    {
                      uid: response.user.id,
                      fid: response.friend.id,
                      facct: formResult.selectedAccts,
                      uacct: ""
                    })
                    .then(
                      (result: boolean) => {
                        this.invites.reqs = this.invites.reqs.filter((e, i) => { return i !== index });
                      }
                    );
                }
                else {
                  uacct = this.invites.reqs[index].get('fromAddr');
                  this._moralis.editAcct({ uid: response.user.id, fid: response.friend.id, facct: formResult.selectedAccts, uacct });
                }
              }
            }
          );
        }
      );
  };
  decline = (index: number) => {
    this._moralis.removeInvite(this.invites.reqs[index].id)
      .then(
        (response: boolean) => {
          this.invites.reqs = this.invites.reqs.filter((e, i) => { return i !== index });
        }
      );
  };
  cancel = (index: number) => {
    this._moralis.cancelRequest(this.invites.pends[index].id)
      .then(
        (response: boolean) => {
          this.invites.pends = this.invites.pends.filter((e, i) => { return i !== index });
        }
      );
  }
}
