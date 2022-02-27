import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { _UrlItem, _UrlList, _UserInfo } from 'src/app/shared/data_layout';

@Component({
  selector: 'app-histlist',
  templateUrl: './histlist.component.html',
  styleUrls: ['./histlist.component.css']
})
export class HistlistComponent implements OnInit {
  user?: _UserInfo;
  currMonth: Array<_UrlItem> = [];
  month: string = "";
  monthIndex: number = -1;
  prevMonth: string = "";
  nxtMonth: string = "";
  maxLen: number = -1;
  constructor(private _apiservice: ApiService, public loader: LoaderService, private _route: Router, private _router: ActivatedRoute) {
    _router.params.subscribe(
      (param) => {
        this.month = param['month'];
        loader.isLoading.next(true);
        this._apiservice.HistoryUpdated.subscribe(
          (result: Array<_UrlList>) => {
            this.onLoad(result);
          }
        );
        this._apiservice.getHistory()
          .subscribe(
            (result: Array<_UrlList>) => {
                this.onLoad(result);
            }
          );

        _apiservice.getUserInfo()
          .subscribe(
            (result: _UserInfo) => {
              this.user = result;
            }
          );
      }
    );
  };
  ngOnInit(): void { };
  handleDelete = (urlId: string) => {
    this.loader.deleteProgress.next(true);
    if (urlId.length !== 0 && urlId) {
      this._apiservice.delUrl(urlId)
        .subscribe(
          (response: boolean) => {
            if (response) {
              this.loader.deleteProgress.next(false);
              this.currMonth = this.currMonth.filter(x => x.urlId !== urlId);
              if (this.user) {
                this._apiservice.updateHistory(this.user.id);
              }
            }
          },
          (e) => {
            console.log(e.error);
          }
        );
    }
  };
  onLoad = (result: Array<_UrlList>) => {
    this.maxLen = result.length;
    this.monthIndex = result.findIndex(x => x.name === this.month);
    if (this.monthIndex != -1) {
      this.currMonth = result[this.monthIndex].urls;
      if (this.monthIndex === 0) {
        this.nxtMonth = result[this.monthIndex + 1].name;
      }
      else if (this.monthIndex === result.length - 1) {
        this.prevMonth = result[this.monthIndex - 1].name;
      }
      else {
        this.nxtMonth = result[this.monthIndex + 1].name;
        this.prevMonth = result[this.monthIndex - 1].name;
      }
    }
    this.loader.isLoading.next(false);
  };
}
