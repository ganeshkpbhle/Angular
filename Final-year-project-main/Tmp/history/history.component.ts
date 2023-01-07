import { AfterViewInit, Component, Injectable, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Moralis from 'moralis/types';
import { chain, displayedHistory, getChainInfo, HistoryView, StatusData } from 'src/app/Shared/data-layout';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { Web3Service } from 'src/app/Shared/services/web3.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  form: FormGroup;
  chainList: Array<{ id: number, name: string, desc: string }> = chain;
  max = new Date();
  dataSource: MatTableDataSource<HistoryView>;
  currentAcct: string = "";
  userObj?: Moralis.User | null;
  historyArr: Array<HistoryView> = [];
  displayedColumns: Array<string> = displayedHistory;
  constructor(private fb: FormBuilder, private _moralis: MoralisService, private ngZone: NgZone, private _web3: Web3Service) {
    this.form = fb.group({
      startdate: fb.control("", [Validators.required]),
      enddate: fb.control("", [Validators.required]),
      network: fb.control("", [Validators.required])
    });
    _moralis.SessionObjectChange.subscribe(
      (result: Moralis.User) => {
        this.currentAcct = result.get('ethAddress');
        this.userObj = result;
        this.historyArr = _moralis.CachedHistory;
        this.form.patchValue(
          { network: this._moralis.chainid }
        );
      }
    );
    _moralis.HistChange.subscribe(
      (result: Array<HistoryView>) => {
        ngZone.run(() => {
          this.historyArr = result;
          this.dataSource = new MatTableDataSource<HistoryView>(this.historyArr);
        });
      }
    );
    this.dataSource = new MatTableDataSource<HistoryView>(this.historyArr);
  };
  ngOnInit(): void {
    const currdate: Date = new Date();
    this.form.patchValue(
      {
        network: this._moralis.chainid,
        startdate: new Date(currdate.setDate(currdate.getDate() - 1)),
        enddate: new Date(currdate.setDate(currdate.getDate() + 1))
      }
    );
    this.userObj = this._moralis.getCachedUser();
    this.historyArr = this._moralis.CachedHistory;
    this.dataSource = new MatTableDataSource<HistoryView>(this.historyArr);
  }
  ngAfterViewInit(): void {
    this.currentAcct = this.userObj?.get('ethAddress');
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  };
  ngOnDestroy(): void {

  }
  public get nwkCtrl(): AbstractControl {
    return this.form.controls['network'];
  };

  public get datectrl(): Array<AbstractControl> {
    return [this.form.controls['startdate'], this.form.controls['enddate']];
  }

  dateChange = (start: string, end: string) => {
    if (start && end) {
      this._moralis.fetchHistory({ chain: this.nwkCtrl.value, addr: this.currentAcct, start:new Date(start), end:new Date(end) })
      .then(
        (result: Array<HistoryView>) => {
          this.ngZone.run(
            () => {
              this._moralis.HistChange.emit(result);
              this.historyArr = result;
            }
          );
        }
      );
    }
  };
  networkChange = () => {
    this._moralis.fetchHistory({ chain: this.nwkCtrl.value, addr: this.currentAcct, start: this.datectrl[0].value, end: this.datectrl[1].value })
      .then(
        (result: Array<HistoryView>) => {
          this.ngZone.run(
            () => {
              this._moralis.HistChange.emit(result);
              this.historyArr = result;
            }
          );
        }
      );
  };
  getSymbolforToken = (tokenaddr: string): string => {
    return getChainInfo(this.nwkCtrl.value).subchains.filter(e => e.contractId === tokenaddr)[0]?.symbol;
  };
  getlocalDate = (datestr: string): string => {
    const date: Date = new Date(datestr);
    return date.toUTCString();
  }
}
