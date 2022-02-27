import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { _ComputeResult, _UrlList, _UserInfo } from 'src/app/shared/data_layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  _history: Array<_UrlList>=[];
  graphFeed: Array<_ComputeResult> = [];
  // options for Pie
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legend: any = "right"
  view: any = [600, 400];
  colorScheme: any = {
    domain: ['#33FFE7', '#33FF89', '#FFBB28', '#7933FF', '#C70039', '#FF8042', '#035652', '#886119', '#FF33F3', '#E91A1A', '#FFFFFF', '#250505']
  };

  constructor(private _apiservice: ApiService, public loader: LoaderService) {
  }

  ngOnInit(): void {
    this._apiservice.getHistory()
      .subscribe(
        (result: Array<_UrlList>) => {
          if(this._history.length===0 && this.graphFeed.length===0){
            this.onLoad(result);
          }
        },
        (e) => {
          console.log(e.error);
        }
      );
    this._apiservice.HistoryUpdated
      .subscribe(
        (result: Array<_UrlList>) => {
          this.onLoad(result);
        }
      );
  };
  onLoad = (param: Array<_UrlList>) => {
    this.graphFeed = [];
    this._history = param;
    this.loader.isLoading.next(false);
    this._history.forEach(item => {
      this.graphFeed.push({ name: item.name, value: item.count });
    });
  };
}
