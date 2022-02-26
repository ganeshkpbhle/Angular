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
  _history: Array<_UrlList> | undefined;
  graphFeed:Array<_ComputeResult>=[];
  // options for Pie
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legend:any="below"
  view: any = [700, 500];
  colorScheme:any = {
    domain: ['#33FFE7', '#33FF89', '#FFBB28', '#7933FF', '#C70039', '#FF8042', '#035652', '#886119', '#FF33F3', '#E91A1A', '#FFFFFF', '#250505']
  };

  constructor(private _apiservice: ApiService, public loader: LoaderService) {
  }

  ngOnInit(): void {
    this._apiservice.getUserInfo()
      .subscribe(
        (result: _UserInfo) => {
          this._apiservice.getUrls(result.id)
            .subscribe(
              (response: Array<_UrlList>) => {
                this._apiservice.setHistory(response);
                this._history = response;
                this.loader.isLoading.next(false);
                this._history.forEach(item =>{
                  this.graphFeed.push({name:item.name,value:item.count});
                });
              },
              (e) => {
                console.log(e.error);
              }
            );
        },
        (e) => {
          console.log(e.error);
        }
      );
  }

}
