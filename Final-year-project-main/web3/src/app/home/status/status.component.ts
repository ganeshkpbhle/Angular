import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Moralis from 'moralis';
import { StatusData } from 'src/app/Shared/data-layout';
import { CommonService,chains } from 'src/app/Shared/services/common.service';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { Web3Service } from 'src/app/Shared/services/web3.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {
  form: FormGroup;
  accts: Array<string> = [];
  user?: Moralis.User | null;
  chains: Array<{ id: number, name: string, desc: string }> = chains;
  stats: Array<StatusData> = [];
  currentAcct: string = "";
  statusSocket?: Moralis.LiveQuerySubscription;
  statusSocket1?: Moralis.LiveQuerySubscription;
  constructor(private fb: FormBuilder, private _moralis: MoralisService, private ngZone: NgZone, private _web3: Web3Service,public _common:CommonService) {
    this.form = fb.group({
      account: fb.control("", [Validators.required]),
      chain: fb.control("", [Validators.required])
    });

    _moralis.SessionObjectChange.subscribe(
      (result: Moralis.User) => {
        ngZone.run(() => {
            this.user = result;
            if (result !== null) {
              this.currentAcct = result.get('ethAddress');
              this.setStatusSocket();
              this.accts = result.get('accounts');
              this.form.patchValue({
                account: this.accts.indexOf(this.currentAcct),
                chain: this.nwkid
              });
            }
        });
      }
    );
    _moralis.StatusArrChange.subscribe(
      (result: Array<StatusData>) => {
        ngZone.run(() => {
          this.stats = result;
          this.user = _moralis.getCachedUser;
        });
      }
    );
    _web3.chainChange.subscribe(
      (id: string) => {
        ngZone.run(() => {
          this.stats = [];
          const Id=_common.getIdFromStr(id);
          this.form.patchValue({
            chain: (Id === -1) ? "no network found" :Id
          });
          _moralis.fetchStatus({ chain:Id, addr: this.currentAcct }).then((res: Array<StatusData>) => { _moralis.StatusArrChange.emit(res); });
        });
      }
    );
    _web3.accountChange.subscribe(
      (acct: string) => {
        if (this.user && this.user !== null) {
          this.currentAcct = acct;
          ngZone.run(() => {
            this.form.patchValue({
              account: this.accts.indexOf(acct)
            });
            _moralis.fetchStatus({ chain: parseInt(this.nwkctrl.value), addr: this.currentAcct }).then((res: Array<StatusData>) => { _moralis.StatusArrChange.emit(res); });
          });
        }
      }
    );
  };

  public get acctrl(): AbstractControl {
    return this.form.controls['account'];
  }

  public get nwkctrl(): AbstractControl {
    return this.form.controls['chain'];
  }

  public get nwkid(): number {
    return this._moralis.chainid;
  }

  ngOnInit(): void {
    this.user = this._moralis.getCachedUser;
    this.stats = this._moralis.getCachedStatus;
    if (this.user && this.user !== null) {
      this.currentAcct = this.user.get('ethAddress');
      this.setStatusSocket();
      this.accts = this.user.get('accounts');
      this.form.patchValue({
        account: this.accts.indexOf(this.currentAcct),
        chain: this.nwkid
      });
    }
  };
  ngOnDestroy(): void {
    this.ngZone.run(() => {
      this.statusSocket?.unsubscribe();
      this.stats = [];
    });
  }
  acctChange = () => {
    this.currentAcct = this.accts[parseInt(this.acctrl.value)];
    const id = this.nwkctrl.value;
    this._moralis.fetchStatus({ chain: id, addr: this.currentAcct }).then((result) => { this._moralis.StatusArrChange.emit(result); });
  };
  chainChange = () => {
    this._moralis.fetchStatus({ chain: parseInt(this.nwkctrl.value), addr: this.currentAcct }).then((result) => { this._moralis.StatusArrChange.emit(result); });
  };
  setStatusSocket = async () => {
    if (this.statusSocket1?.listenerCount.length !== 0) {
      this.statusSocket1?.unsubscribe();
    }
    if (this.statusSocket?.listenerCount.length !== 0) {
      this.statusSocket?.unsubscribe();
    }
    if (this.user) {
      this.statusSocket = await new Moralis.Query('Transactions').equalTo('senderAddress', this.currentAcct).subscribe();
      this.statusSocket.on('update', (obj: Moralis.Object) => {
        if (obj.get('confirmed')) {
          const reqHash: string = obj.get('transactionHash');
          const ind: number = this.stats.map(e => {
            return e.transactionhash
          }).indexOf(reqHash);
          this.stats[ind].confirm = true;
          this._moralis.StatusArrChange.emit(this.stats);
        }
      });
      this.statusSocket1 = await new Moralis.Query('Transactions').equalTo('receiverAddress', this.currentAcct).subscribe();
      this.statusSocket1.on('update', (obj: Moralis.Object) => {
        if (obj.get('confirmed')) {
          const reqHash: string = obj.get('transactionHash');
          const ind: number = this.stats.map(e => {
            return e.transactionhash
          }).indexOf(reqHash);
          this.stats[ind].confirm = true;
          this._moralis.StatusArrChange.emit(this.stats);
        }
      });
    }
  }
}
