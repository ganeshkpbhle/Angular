import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Moralis from 'moralis';
import { Contacts, Contact_Address,TransferPost, StatusData, BalanceCheck, metaData } from 'src/app/Shared/data-layout';
import { CommonService,category } from 'src/app/Shared/services/common.service';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { Web3Service } from 'src/app/Shared/services/web3.service';
import { InitsuccessComponent } from './initsuccess/initsuccess.component';
import { ReinitComponent } from './reinit/reinit.component';
@Component({
  selector: 'app-transferasset',
  templateUrl: './transferasset.component.html',
  styleUrls: ['./transferasset.component.css']
})
export class TransferassetComponent implements OnInit {
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  friends: Array<Contacts> = [];
  recvAcct: Array<Contact_Address> = [];
  userObj?: Moralis.User | null;
  currentAcct: string = "";
  catArr: Array<string> = category;
  unit: string = "";
  selfAddr: Array<string> = [];
  tokenAdrrs: Array<{ token: { name: string, decimals: string, desc: string, contractId: string, coll: string }, balance: string }> = [];
  constructor(private _moralis: MoralisService, private _web3: Web3Service, private ngZone: NgZone, private _router: Router, private dialog: MatDialog, public _common: CommonService) {
    this.form1 = new FormGroup({
      currentAcct: new FormControl(this.currentAcct, [Validators.required]),
      receiverName: new FormControl("", [Validators.required]),
      receiverAddr: new FormControl("", [Validators.required]),
      network: new FormControl("", [Validators.required]),
      amount: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      desc: new FormControl("", [Validators.required, Validators.minLength(6)]),
      tokens: new FormControl("", [Validators.required])
    });
    this.form2 = new FormGroup({
      currentAcct: new FormControl(""),
      receiverName: new FormControl("", [Validators.required]),
      receiverAddr: new FormControl("", [Validators.required]),
      network: new FormControl(""),
      amount: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      desc: new FormControl("", [Validators.required, Validators.minLength(6)]),
      tokens: new FormControl("", [Validators.required])
    });
    this.form3 = new FormGroup({
      currentAcct: new FormControl(""),
      toaddress: new FormControl("", [Validators.required]),
      network: new FormControl(""),
      amount: new FormControl("", [Validators.required]),
      tokens: new FormControl("", [Validators.required])
    });
    _moralis.ContactArrChange.subscribe(
      (res: Array<Contacts>) => {
        this.friends = res.filter(e => e.block===false);
      }
    );
    _moralis.SessionObjectChange.subscribe(
      (res: Moralis.User) => {
        ngZone.run(() => {
          this.userObj = res;
          if (res !== null) {
            const currentAcct: string = this.userObj.get('ethAddress');
            this.setTokenData(this.chainInfo, this.chainId, currentAcct);
            this.form1.patchValue({
              currentAcct,
              network: _common.getChainInfo(this.chainId).desc,
              tokens: 0
            });
            this.form2.patchValue({
              currentAcct,
              network: _common.getChainInfo(this.chainId).desc,
              tokens: 0
            });
            this.form3.patchValue({
              currentAcct,
              network: _common.getChainInfo(this.chainId).desc,
              tokens: 0
            });
            this.selfAddr = (this.userObj.get('accounts') as Array<string>).filter((e) => { return e !== currentAcct });
          }
        });
      });
    _web3.chainChange.subscribe(
      (id: string) => {
        const pid: number = parseInt(id);
        const chinfo = _common.getChainInfo(pid);
        this.setTokenData(chinfo, pid, this.currentAcct);
        this.form1.patchValue({
          network: _common.getChainInfo(pid).desc
        });
        this.form2.patchValue({
          network: _common.getChainInfo(pid).desc
        });
        this.form3.patchValue({
          network: _common.getChainInfo(pid).desc
        });
        if (this.userObj) {
          ngZone.run(() => {
            _moralis.chain = id;
          });
        }
      }
    );
    _web3.accountChange.subscribe(
      (acct: string) => {
        if (this.userObj) {
          this.setTokenData(_common.getChainInfo(this.chainId), this.chainId, acct);
          this.form1.patchValue({
            currentAcct: acct
          });
          this.form2.patchValue({
            currentAcct: acct
          });
          this.form3.patchValue({
            currentAcct: acct
          });
          if (this.userObj) {
            this.selfAddr = (this.userObj.get('accounts') as Array<string>).filter((e) => { return e !== acct });
            ngZone.run(() => {
              this.currentAcct = acct;
            });
          }
        }
      }
    )
  }

  public get recvCtrl() {
    return this.form1.controls['receiverName'];
  }
  public get unitCtrl(): Array<AbstractControl> {
    const ctrl: Array<AbstractControl> = [this.form1.controls['amount'], this.form2.controls['amount'], this.form3.controls['amount']]
    return ctrl;
  }
  public get sfaddrCtrl(): AbstractControl {
    return this.form3.controls['toaddress'];
  }
  public get tokenctrl(): Array<AbstractControl> {
    return [this.form1.controls['tokens'], this.form2.controls['tokens'], this.form3.controls['tokens']];
  }

  public get chainId(): number {
    return this._moralis.chainid;
  }

  public get chainInfo(): { name: string, desc: string, coll: string, subchains: Array<{ name: string, decimals: string, desc: string, contractId: string, coll: string, symbol: string }> } {
    return this._common.getChainInfo(this.chainId);
  }

  ngOnInit(): void {
    this.friends = this._moralis.getCachedContacts.filter(e => e.block===false);
    const user = this._moralis.getCachedUser;
    this._common.navExpand.emit(false);
    if (user !== null && user && this.chainId !== -1) {
      this.userObj = user;
      const currentAcct: string = user.get('ethAddress');
      this.setTokenData(this.chainInfo, this.chainId, currentAcct);
      this.form1.patchValue({
        currentAcct,
        network: this.chainInfo.desc,
        tokens: 0
      });
      this.userObj = this._moralis.getCachedUser;
      this.form2.patchValue({
        currentAcct,
        network: this.chainInfo.desc,
        tokens: 0
      });
      this.form3.patchValue({
        currentAcct,
        network: this.chainInfo.desc,
        tokens: 0
      });
      this.selfAddr = (this.userObj?.get('accounts') as Array<string>).filter((e) => { return e !== currentAcct });
    }
  };
  receiverChange = () => {
    this.recvAcct = [];
    this.recvAcct = this.friends[this.recvCtrl.value].accounts;
  };
  submitFriendly = () => {
    if (this.form1.valid) {
      const contract: string = this.tokenAdrrs[this.form1.controls['tokens'].value].token.contractId;
      Moralis.transfer(this._moralis.getTransferOpt(this.chainId, contract, this.form1.controls['receiverAddr'].value, this.form1.controls['amount'].value)).then(
        async (transaction: Moralis.TransferResult) => {
          this.initsuccess(transaction.hash);
          if (this.userObj) {
            let payload: TransferPost = {
              senderName: this.userObj?.getUsername(),
              receiverName: this.friends[this.recvCtrl.value].actualName,
              units: this.form1.controls['amount'].value,
              catg: this.form1.controls['category'].value,
              desc: this.form1.controls['desc'].value,
              network: this.chainId.toString(),
              sendAddr: this.userObj.get('ethAddress'),
              recvAddr: this.form1.controls['receiverAddr'].value,
              transactionhash: transaction.hash,
              tokenAddress: contract,
              tstamp: new Date().toISOString()
            };
            await this._moralis.transferPost(payload);
            this.setTokenData(this._common.getChainInfo(this.chainId), this.chainId, this.currentAcct);
            if (transaction.hash) { this._moralis.setWebSocket({ hash: transaction.hash, coll: this.tokenAdrrs[this.form2.controls['tokens'].value].token.coll }); }
            let stats: Array<StatusData> = this._moralis.getCachedStatus;
            stats.unshift({
              senderName: payload.senderName,
              receiverName: payload.receiverName,
              units: payload.units,
              catg: payload.catg,
              desc: payload.desc,
              network: payload.network.toString(),
              sendAddr: payload.sendAddr,
              recvAddr: payload.recvAddr,
              transactionhash: transaction.hash,
              confirm: false,
              gas: transaction.gasPrice?.toBigInt(),
              tstamp: new Date().toUTCString(),
              tokenAddress: payload.tokenAddress
            });
            this._moralis.StatusArrChange.emit(stats);
          }
        }
      )
        .catch(
          (err) => {
            if (err?.code) {
              this.initFailure();
            }
          }
        );
    }
  };
  submitOthers = async () => {
    if (this.form2.valid) {
      const contract: string = this.tokenAdrrs[this.form2.controls['tokens'].value].token.contractId;
      Moralis.transfer(this._moralis.getTransferOpt(this.chainId, contract, this.form2.controls['receiverAddr'].value, this.form2.controls['amount'].value)).then(
        async (transaction: Moralis.TransferResult) => {
          this.initsuccess(transaction.hash);
          if (this.userObj) {
            let payload: TransferPost = {
              senderName: this.userObj?.getUsername(),
              receiverName: this.form2.controls['receiverName'].value,
              units: this.form2.controls['amount'].value,
              catg: this.form2.controls['category'].value,
              desc: this.form2.controls['desc'].value,
              network: this.chainId.toString(),
              sendAddr: this.userObj.get('ethAddress'),
              recvAddr: this.form2.controls['receiverAddr'].value,
              transactionhash: transaction.hash,
              tokenAddress: this.tokenAdrrs[this.form1.controls['tokens'].value].token.contractId,
              tstamp: new Date().toISOString()
            };
            await this._moralis.transferPost(payload);
            const chinfo = this._common.getChainInfo(this.chainId);
            this.setTokenData(chinfo, this.chainId, this.currentAcct);
            if (transaction.hash) { this._moralis.setWebSocket({ hash: transaction.hash, coll: chinfo.coll }); }
            let stats: Array<StatusData> = this._moralis.getCachedStatus;
            stats.unshift({
              senderName: payload.senderName,
              receiverName: payload.receiverName,
              units: payload.units,
              catg: payload.catg,
              desc: payload.desc,
              network: payload.network.toString(),
              sendAddr: payload.sendAddr,
              recvAddr: payload.recvAddr,
              transactionhash: transaction.hash,
              confirm: false,
              gas: transaction.gasPrice?.toBigInt(),
              tstamp: new Date().toUTCString(),
              tokenAddress: payload.tokenAddress
            });
            this._moralis.StatusArrChange.emit(stats);
          }
        }
      )
        .catch(
          (err) => {
            if (err?.code) {
              this.initFailure();
            }
          }
        );
    }
  };
  submitSelf = () => {
    if (this.form3.valid) {
      const contract: string = this.tokenAdrrs[this.form3.controls['tokens'].value].token.contractId;
      Moralis.transfer(this._moralis.getTransferOpt(this.chainId, contract, this.selfAddr[this.sfaddrCtrl.value], this.form3.controls['amount'].value)).then(
        async (transaction: Moralis.TransferResult) => {
          this.initsuccess(transaction.hash);
          if (this.userObj) {
            try {
              let payload: TransferPost = {
                senderName: this.userObj?.getUsername(),
                receiverName: "YourSelf",
                units: this.form3.controls['amount'].value,
                catg: "Personal",
                desc: "Self Transfer",
                network: this.chainId.toString(),
                sendAddr: this.userObj.get('ethAddress'),
                recvAddr: this.selfAddr[this.sfaddrCtrl.value],
                transactionhash: transaction.hash,
                tokenAddress: this.tokenAdrrs[this.form3.controls['tokens'].value].token.contractId,
                tstamp: new Date().toUTCString()
              };
              await this._moralis.transferPost(payload);
              const chinfo = this._common.getChainInfo(this.chainId);
              this.setTokenData(chinfo, this.chainId, this.currentAcct);
              if (transaction.hash) { this._moralis.setWebSocket({ hash: transaction.hash, coll: chinfo.coll }); }
              let stats: Array<StatusData> = this._moralis.getCachedStatus;
              stats.unshift({
                senderName: payload.senderName,
                receiverName: payload.receiverName,
                units: payload.units,
                catg: payload.catg,
                desc: payload.desc,
                network: payload.network.toString(),
                sendAddr: payload.sendAddr,
                recvAddr: payload.recvAddr,
                transactionhash: transaction.hash,
                confirm: false,
                gas: transaction.gasPrice?.toBigInt(),
                tstamp: new Date().toISOString(),
                tokenAddress: payload.tokenAddress
              });
              this._moralis.StatusArrChange.emit(stats);

            } catch (error) {
              console.log(error);
            }
          }
        }
      )
        .catch(
          (err) => {
            if (err?.code) {
              this.initFailure();
            }
          }
        );
    }
  };
  balanceCheck = (ctrlIndex: number) => {
    const id = this.chainId;
    const chinfo = this._common.getChainInfo(id);
    this._moralis.getAcctBalance(id, this.currentAcct, [chinfo.subchains[this.tokenctrl[ctrlIndex].value].contractId])
      .then(
        (balance: Array<BalanceCheck>) => {
          if (balance.length > 0) {
            if (this.unitCtrl[ctrlIndex].value?.length !== 0 && this.unitCtrl[ctrlIndex].value !== null) {
              if (parseInt(Moralis.Units.FromWei(balance[0].balance, balance[0].decimals)) < parseInt(this.unitCtrl[ctrlIndex].value)) {
                this.unitCtrl[ctrlIndex].setErrors({
                  'low': true
                });
              }
              if (parseFloat(this.unitCtrl[ctrlIndex].value) <= 0) {
                this.unitCtrl[ctrlIndex].setErrors({
                  'invalid': true
                });
              }
            }
          }
          else {
            this.unitCtrl[ctrlIndex].setErrors({
              'low': true
            });
            if (parseFloat(this.unitCtrl[ctrlIndex].value) <= 0) {
              this.unitCtrl[ctrlIndex].setErrors({
                'invalid': true
              });
            }

          }
        }
      );
  };
  initsuccess = (hash: string | undefined) => {
    let dialogRef: MatDialogRef<InitsuccessComponent> = this.dialog.open(InitsuccessComponent, {
      width: "100%",
      height: "50%",
      disableClose: true,
      data: {
        hash
      }
    });
    dialogRef.componentInstance.redirect.subscribe(
      (path: string) => {
        this._router.navigate([`/home/${path}`]);
      }
    );
  };
  initFailure = () => {
    let dialogRef: MatDialogRef<ReinitComponent> = this.dialog.open(ReinitComponent, {
      width: "100%",
      height: "40%",
      disableClose: true
    });
  };
  setTokenData = (chInfo: {
    name: string, desc: string, coll: string,
    subchains: Array<{
      name: string,
      decimals: string,
      desc: string,
      contractId: string,
      coll: string,
      symbol: string
    }>
  }, id: number, acct: string) => {
    const mappedIds: Array<string> = chInfo.subchains.map(e => e.contractId);
    this._moralis.getAcctBalance(id, acct, mappedIds)
      .then(
        (blnc: Array<BalanceCheck>) => {
          this.ngZone.run(() => {
            this.tokenAdrrs = chInfo.subchains.map(
              (e) => {
                const ind: number = blnc.findIndex(obj => obj.token_address === e.contractId.toLowerCase());
                return {
                  token: {
                    name: e.name,
                    decimals: e.decimals,
                    desc: e.desc,
                    contractId: e.contractId,
                    coll: e.coll
                  },
                  balance: (ind !== -1) ? `${Moralis.Units.FromWei(blnc[ind].balance, blnc[ind].decimals)}   ${e.symbol}` : `0  ${e.symbol}`
                }
              }
            );
          });
        }
      );
  };

}