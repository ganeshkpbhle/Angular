import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import Moralis from 'moralis/types';
import { Contacts, InvitesData } from 'src/app/Shared/data-layout';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { NewcontactComponent } from './newcontact/newcontact.component';
import { environment } from 'src/environments/environment';
import { EditcontactComponent } from './editcontact/editcontact.component';
import { ViewcontactComponent } from './viewcontact/viewcontact.component';
import { NotificationComponent } from './notification/notification.component';
import { CommonService } from 'src/app/Shared/services/common.service';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  friends: Array<Contacts> = [];
  invites: InvitesData = { reqs: [], pends: [] };
  userObj?: Moralis.User | null;
  dpUrl: string = environment.dicebear;
  constructor(private _moralis: MoralisService, private _router: Router, private _route: ActivatedRoute
    , private dialog: MatDialog, private ngzone: NgZone, private _common: CommonService) {
    this._moralis.SessionObjectChange.subscribe(
      (user: Moralis.User) => {
        this.userObj = user;
      }
    );
    this.ngzone.run(() => {
      _moralis.ContactArrChange.subscribe(
        (arr: Array<Contacts>) => {
          this.friends = arr;
        }
      );
      this._moralis.InvitesChange.subscribe(
        (obj: InvitesData) => {
          this.invites = obj;
        }
      );
    });
  }

  ngOnInit(): void {
    this.userObj = this._moralis.getCachedUser;
    this.friends = this._moralis.getCachedContacts;
    this.invites = this._moralis.getCachedInvites;
  }
  addContact = () => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height = "50%";
    dialogConfig.width = "100%";
    this.dialog.open(NewcontactComponent, dialogConfig);
  };
  editContact = (index: number) => {
    let dialogRef: MatDialogRef<EditcontactComponent> = this.dialog.open(EditcontactComponent, {
      width: "100%",
      height: "50%",
      disableClose: true,
      data: {
        card: this.friends[index],
        ind: index
      }
    });
    dialogRef.componentInstance.nameChange.subscribe(
      (result) => {
        this.friends[result.index].name = result.name;
        this._moralis.ContactArrChange.emit(this.friends);
      }
    );
  };
  viewContact = (index: number) => {
    let dialogRef: MatDialogRef<ViewcontactComponent> = this.dialog.open(ViewcontactComponent, {
      width: "100%",
      height: "50%",
      disableClose: false,
      data: {
        card: this.friends[index],
      }
    });
    dialogRef.componentInstance.blockChange.subscribe(
      (payload: { flg: boolean, id: string }) => {
        this._moralis.blockFriend(payload).then(() => {
          const contacts = this._moralis.getCachedContacts;
          const ind = contacts.findIndex(e => e.contactId === payload.id);
          contacts[ind].block =payload.flg;
          this._moralis.ContactArrChange.emit(contacts);
        });
      }
    );
  };
  viewNotification = () => {
    let dialogRef = this.dialog.open(NotificationComponent, {
      width: "60%",
      height: "60%",
      disableClose: false,
      data: {
        invites: this.invites,
        user: this.userObj
      }
    });
  };
}
