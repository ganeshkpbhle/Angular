import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { _ComputeResult, _FeedPattn, _PostUrl, _UrlCompute, _UserInfo } from '../../shared/data_layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  info: _UserInfo | undefined;
  graphFeed: Array<_FeedPattn>=[];
  view: any = [650, 450];

  // options for Graph
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private _apiservice: ApiService,public loader:LoaderService) {
    this.form = new FormGroup({
      url: new FormControl("", [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
      result: new FormControl("")
    });
  }

  public get m(): FormGroup['controls'] {
    return this.form.controls
  }

  ngOnInit(): void {
    this._apiservice.getUserInfo()
      .subscribe((data: _UserInfo) => {
        this.info = data;
        this.loader.isLoading.next(false);
        const payload: _UrlCompute = { Id: this.info.id, Opt: 1 };
        this._apiservice.ComputeDate(payload)
          .subscribe(
            (response: Array<_ComputeResult>) => {
              this.graphFeed.push({ name: 'active_cnt', series: response });
            },
            (e) => {
              console.log(e.error);
            }
          );
      });
  }

  RandGen = () => {
    let rslt = "";
    const strRand = "A348rstuvRSTUV5opqMzGHNOPQ6DEFjklBC012mnXYZabcdefghi7WwxyIJKL9";
    const strLen = strRand.length;
    for (var i = 0; i < 6; i++) {
      rslt += strRand.charAt(Math.floor(Math.random() * strLen));
    }
    return rslt;
  };

  submit = () => {
    if (this.form.valid && this.info) {
      const date = new Date();
      const payload: _PostUrl = {
        UrlId: this.RandGen(),
        LongUrl: this.m['url'].value,
        CreatedDate: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 19),
        UserId: this.info.id
      };
      this._apiservice.addUrl(payload)
        .subscribe(
          (response: boolean) => {
            if (response) {
              this.form.patchValue({ result: `bit.ly/${payload.UrlId}` });
            }
          },
          (e) => {
            console.log(e.error);
          }
        );
    }
  };
  clear = () => {
    this.form.reset();
  };
}
