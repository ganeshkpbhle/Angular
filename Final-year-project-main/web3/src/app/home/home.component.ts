import { Component, NgZone, OnInit } from '@angular/core';
import Moralis from 'moralis';
import { Contacts, GeneralCount, GeneralGraphPlot, HistoryView, InvitesData, StatusData } from '../Shared/data-layout';
import { MoralisService } from '../Shared/services/moralis.service';
import { Web3Service } from '../Shared/services/web3.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userObj?: Moralis.User | null;
  alignCenter: boolean = true;
  opened:boolean=false;
  constructor(private _moralis: MoralisService, private _web3: Web3Service, private ngZone: NgZone) {

  }
  ngOnInit(): void {
    this.userObj = this._moralis.getCachedUser;
    this._moralis.SessionObjectChange.subscribe(
      (obj: Moralis.User) => {
        this.userObj = obj;
        if (obj) {
          this.ngZone.run(() => {
            const id = this._moralis.chainid;
            const currentAcct: string = obj.get('ethAddress');
            const currdate: Date = new Date();
            this.liveUpdates(obj);
            this._moralis.fetchContacts().then(
              (chddata: Array<Contacts>) => {
                this._moralis.ContactArrChange.emit(chddata);
              }
            );
            this._moralis.fetchInvites().then(
              (chdata: InvitesData) => {
                this._moralis.InvitesChange.emit(chdata);
              }
            );
            this._moralis.fetchPlotData(obj.id).then(
              (chdata:{ numcard: Array<GeneralCount>, catg: Array<GeneralGraphPlot> })=>{
                this._moralis.plotDataChange.emit(chdata);
              }
            );
            if(id!==-1){
              this._moralis.fetchStatus({chain:id,addr:currentAcct})
              .then(
                (result:Array<StatusData>)=>{
                  this._moralis.StatusArrChange.emit(result);
                }
              );
              // this._moralis.fetchHistory({chain:id,addr:currentAcct,start:new Date(currdate.setDate(currdate.getDate() - 1)).toISOString(),end:new Date(currdate.setDate(currdate.getDate() + 1)).toISOString()}).then(
              //   (result:Array<HistoryView>)=>{
              //     this._moralis.HistChange.emit(result);
              //   }
              // );
              const params={};
              Moralis.Cloud.run('returnData',params).then(
                (response)=>{
                  console.log(response);
                }
              );
            }
          });
        }
      }
    );
    this._moralis.classAdjust.subscribe(
      (cls: boolean) => {
        this.alignCenter = cls;
      }
    );
  };
  liveUpdates = async (obj: Moralis.User) => {
    let pends = await new Moralis.Query('Pending').equalTo('userName', obj.getUsername).subscribe();
    pends.on('create', () => {
      this._moralis.fetchInvites().then(
        (response: InvitesData) => {
          this._moralis.InvitesChange.emit(response);
        }
      );
    });
    let reqs = await new Moralis.Query('Requests').equalTo('userName', obj.getUsername).subscribe();
    reqs.on('create', () => {
      this._moralis.fetchInvites().then(
        (response: InvitesData) => {
          this._moralis.InvitesChange.emit(response);
        }
      );
    });
    let pendsrm = await new Moralis.Query('Pending').equalTo('userName', obj.getUsername).subscribe();
    pendsrm.on('delete', () => {
      this._moralis.fetchInvites().then(
        (response: InvitesData) => {
          this._moralis.InvitesChange.emit(response);
        }
      );
      this._moralis.fetchContacts().then(
        (response: Array<Contacts>) => {
          this._moralis.ContactArrChange.emit(response);
        }
      );
    });
    let reqsrm = await new Moralis.Query('Requests').equalTo('userName', obj.getUsername).subscribe();
    reqsrm.on('delete', () => {
      this._moralis.fetchInvites().then(
        (response: InvitesData) => {
          this._moralis.InvitesChange.emit(response);
        }
      );
      this._moralis.fetchContacts().then(
        (response: Array<Contacts>) => {
          this._moralis.ContactArrChange.emit(response);
        }
      );
    });
    // let frndchng=await new Moralis.Query('Friends').equalTo('user',obj.getUsername).subscribe();
    // frndchng.on('update',(obj)=>{
    //   const contacts=this._moralis.getCachedContacts;
    //   const ind= contacts.findIndex(e => e.contactId===obj.id);
    //   contacts[ind].block=obj.get('block');
    //   this._moralis.ContactArrChange.emit(contacts);
    // });
  };
}
