import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Moralis from 'moralis/types';
import { HistoryView } from 'src/app/Shared/data-layout';
import { chains, CommonService, displayedHistory } from 'src/app/Shared/services/common.service';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { Web3Service } from 'src/app/Shared/services/web3.service';
import { MatTableExporterModule } from 'mat-table-exporter';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  form: FormGroup;
  chainList: Array<{ id: number, name: string, desc: string }> = chains;
  max = new Date();
  dataSource: MatTableDataSource<HistoryView>;
  currentAcct: string = "";
  userObj?: Moralis.User | null;
  historyArr: Array<HistoryView> = [];
  displayedColumns: Array<string> = displayedHistory;
  constructor(private fb: FormBuilder, private _moralis: MoralisService, private ngZone: NgZone, private _web3: Web3Service, public _common: CommonService) {
    this.form = fb.group({
      startdate: fb.control("", [Validators.required]),
      enddate: fb.control("", [Validators.required]),
      network: fb.control("", [Validators.required])
    });
    _moralis.SessionObjectChange.subscribe(
      (result: Moralis.User) => {
        if (result && result !== null) {
          this.currentAcct = result.get('ethAddress');
          this.userObj = result;
          this.historyArr = _moralis.CachedHistory;
          this.form.patchValue(
            { network: this._moralis.chainid }
          );
        }
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
    _web3.chainChange.subscribe(
      (id: string) => {
        ngZone.run(() => {
          this.historyArr = [];
          const Id = _common.getIdFromStr(id);
          this.form.patchValue({
            network: (Id === -1) ? "no network found" : Id
          });
          const start: Date = new Date();
          const end: Date = new Date();
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          _moralis.fetchHistory({ chain: Id, addr: this.currentAcct, start:[start.getFullYear(),start.getMonth(),start.getDate()],end:[end.getFullYear(),end.getMonth(),end.getDate()] }).then((res: Array<HistoryView>) => { _moralis.HistChange.emit(res); });
        });
      }
    );
    this.dataSource = new MatTableDataSource<HistoryView>(this.historyArr);
  };
  ngOnInit(): void {
    this.form.patchValue(
      {
        network: this._moralis.chainid,
        startdate: new Date(this.currdate.setDate(this.currdate.getDate() - 1)),
        enddate: new Date(this.currdate.setDate(this.currdate.getDate()))
      }
    );
    this.userObj = this._moralis.getCachedUser;
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
    this.historyArr = [];
    let tmp:Date=new Date(this.currdate.setDate(this.currdate.getDate() - 1));
    this._moralis.fetchHistory({
      chain: this.nwkCtrl.value,
      addr: this.currentAcct,
      start:[tmp.getFullYear(),tmp.getMonth(),tmp.getDate()],
      end:[this.currdate.getFullYear(),this.currdate.getMonth(),this.currdate.getDate()]
    }).then(
      (result: Array<HistoryView>) => {
        this._moralis.HistChange.emit(result);
      }
    );
  }
  public get nwkCtrl(): AbstractControl {
    return this.form.controls['network'];
  };

  public get datectrl(): Array<AbstractControl> {
    return [this.form.controls['startdate'], this.form.controls['enddate']];
  }

  public get currdate(): Date {
    return new Date()
  }

  dateChange = (st: string, ed: string) => {
    if (st && ed) {
      const start: Date = new Date(st);
      const end: Date = new Date(ed);
      console.log(st,ed);
      this._moralis.fetchHistory({
        chain: this.nwkCtrl.value, addr: this.currentAcct,
        start: [start.getFullYear(),start.getUTCMonth(),start.getDate()],
        end: [end.getFullYear(),end.getUTCMonth(),end.getDate()]
      })
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
    const start: Date = new Date(this.datectrl[0].value);
    const end: Date = new Date(this.datectrl[1].value);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    this._moralis.fetchHistory({ chain: this.nwkCtrl.value, addr: this.currentAcct, start: [start.getFullYear(),start.getMonth(),start.getDate()], end: [end.getFullYear(),end.getMonth(),end.getDate()] })
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
    return this._common.getChainInfo(this.nwkCtrl.value).subchains.filter(e => e.contractId === tokenaddr)[0]?.symbol;
  };

}
