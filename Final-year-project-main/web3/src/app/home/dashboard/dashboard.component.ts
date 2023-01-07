import { Component, OnInit, OnDestroy, NgZone, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Moralis from 'moralis';
import { GeneralCount, GeneralGraphPlot } from 'src/app/Shared/data-layout';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Web3Service } from 'src/app/Shared/services/web3.service';
import { chains, CommonService } from 'src/app/Shared/services/common.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {
  gradient: boolean = true;
  user?: Moralis.User | null;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  formMonthly: FormGroup;
  chains: Array<{ id: number, name: string, desc: string }> = chains;
  view: any = [1200, 500];
  colorScheme: any = {
    domain: ['#7933FF', '#C70039', '#FF8042', '#035652', '#886119', '#FF33F3', '#E91A1A', '#FFFFFF', '#250505', '#33FFE7', '#33FF89', '#FFBB28']
  };
  plotdata: { numcard: Array<GeneralCount>, catg: Array<GeneralGraphPlot> } = { numcard: [], catg: [] };
  tnin: number = -1;
  tnout: number = -1;
  accts: Array<string> = [];
  currentAcct: string = "";
  currDate = new Date();
  chainAssets: Array<{ name: string, decimals: string, contractId: string, coll: string, desc: string, symbol: string, main: boolean }> = [];
  constructor(private _moralis: MoralisService, private _router: Router, private _web3: Web3Service, private _route: ActivatedRoute,
    private ngzone: NgZone, public fb: FormBuilder, private _common: CommonService) {
    _moralis.plotDataChange.subscribe((data: { numcard: Array<GeneralCount>, catg: Array<GeneralGraphPlot> }) => {
      ngzone.run(() => {
        this.plotdata = data;
        console.log(this.plotdata);
        this.tnin = this.plotdata.numcard.map(e => e.In).reduce((prev, next) => prev + next);
        this.tnout = this.plotdata.numcard.map(e => e.Out).reduce((prev, next) => prev + next);
      });
    });
    this.formMonthly = fb.group({
      account: fb.control("", [Validators.required]),
      chain: fb.control("", [Validators.required]),
      asset: fb.control("", [Validators.required]),
      week: fb.control("", [Validators.required])
    });
    _moralis.SessionObjectChange.subscribe(
      (result: Moralis.User) => {
        ngzone.run(() => {
          const weekno = this.getWeekNo(this.currDate);
          if (result !== null) {
            this.currentAcct = result.get('ethAddress');
            this.accts = result.get('accounts');
            this.chainAssets = this.Assets(this.nwkid);
            this.formMonthly.patchValue({
              account: this.accts.indexOf(this.currentAcct),
              chain: this.nwkid,
              asset: 0,
              week: weekno[0].toString() + '-W' + weekno[1].toString()
            });
          }
        });
      }
    );
    _web3.chainChange.subscribe(
      (id: string) => {
        ngzone.run(() => {
          const Id = _common.getIdFromStr(id);
          this.formMonthly.patchValue({
            chain: (Id === -1) ? "no network found" : Id
          });

        });
      }
    );
    _web3.accountChange.subscribe(
      (acct: string) => {
        if (this.user && this.user !== null) {
          this.currentAcct = acct;
          ngzone.run(() => {
            this.formMonthly.patchValue({
              account: this.accts.indexOf(acct)
            });

          });
        }
      }
    );
  }
  ngOnDestroy(): void {
    this.plotdata = { numcard: [], catg: [] };
  }
  ngOnInit(): void {
    this.user = this._moralis.getCachedUser;
    const weekno = this.getWeekNo(this.currDate);
    if (this.user && this.user !== null) {
      this.currentAcct = this.user.get('ethAddress');
      this.accts = this.user.get('accounts');
      this.chainAssets = this.Assets(this.nwkid);
      this.formMonthly.patchValue({
        account: this.accts.indexOf(this.currentAcct),
        chain: this.nwkid,
        asset: 0,
        week: weekno[0].toString() + '-W' + weekno[1].toString()
      });
      //console.log(this.getWeekRange(weekno[1],weekno[0]));
    }
    this.plotdata = this._moralis.getCachedPlot;
    if (this.plotdata.numcard.length > 0) {
      this.tnin = this.plotdata.numcard.map(e => e.In)?.reduce((prev, next) => prev + next);
      this.tnout = this.plotdata.numcard.map(e => e.Out)?.reduce((prev, next) => prev + next);
    }
  }
  public get acctrl(): AbstractControl {
    return this.formMonthly.controls['account'];
  }

  public get nwkctrl(): AbstractControl {
    return this.formMonthly.controls['chain'];
  }

  public get nwkid(): number {
    return this._moralis.chainid;
  }

  public get currWeek(): string {
    const week = this.getWeekNo(this.currDate);
    return week[0] + '-W' + week[1];
  }

  logOut = () => {
    this._moralis.removeWallet()
      .then(
        () => {
          let user = Moralis.User.current();
          this._moralis.SessionObjectChange.emit(user);
          this._router.navigate(["/signin"], { relativeTo: this._route });
        }
      );
  };
  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.55, 500];
  }
  acctChange = () => {

  };
  chainChange = () => {

  };
  assetChange = () => {

  };
  weekChange = () => {
    const [year, weekno] = (this.formMonthly.controls['week'].value).split('-').map(
      (e: string) => {
        if (e.indexOf('W') !== -1) {
          return parseInt(e.substring(1));
        }
        else {
          return parseInt(e);
        }
      }
    );
    const {weekStart,weekEnd}=this.getWeekRange(weekno,year);
    console.log(weekStart,weekEnd);
    this._moralis.fetchBarPlot({acct:this.currentAcct,start:weekStart,end:weekEnd,chain:parseInt(this.nwkctrl.value)})
    .then(
      (result:any)=>{
        console.log(result);
      }
    );
  };

  Assets = (id: string | number) => {
    if (typeof id === 'string') {
      return this._common.getChainInfo(parseInt(id)).subchains;
    }
    else {
      return this._common.getChainInfo(id).subchains;
    }
  }
  getWeekNo = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((Number(d) - Number(yearStart)) / 86400000) + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
  };
  getWeekRange = (weekNo: number, yearNo: number):{weekStart:string,weekEnd:string} => {
    let firstDayofYear = new Date(yearNo, 0, 1);
    if (firstDayofYear.getDay() > 4) {
      let weekStart:string = new Date(yearNo, 0, 1 + (weekNo - 1) * 7 - firstDayofYear.getDay() + 8).toISOString();
      let weekEnd:string = new Date(yearNo, 0, 1 + (weekNo - 1) * 7 - firstDayofYear.getDay() + 8 + 5).toISOString();
      return { weekStart, weekEnd }
    }
    else {
      let weekStart:string = new Date(yearNo, 0, 1 + (weekNo - 1) * 7 - firstDayofYear.getDay() + 1).toISOString();
      let weekEnd:string = new Date(yearNo, 0, 1 + (weekNo - 1) * 7 - firstDayofYear.getDay() + 1 + 5).toISOString();
      return { weekStart, weekEnd }
    }
  };

}
