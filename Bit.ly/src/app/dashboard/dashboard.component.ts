import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { _PostUrl, _UserInfo } from '../shared/data_layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  info:_UserInfo|undefined;
  constructor(private _apiservice: ApiService) {
    this._apiservice.getUserInfo()
      .subscribe((data:_UserInfo)=>{
        this.info=data;
      });
    this.form = new FormGroup({
      url: new FormControl("", [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
      result:new FormControl("")
    });
  }
  public get m(): FormGroup['controls'] {
    return this.form.controls
  }
  ngOnInit(): void {
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
      const payload:_PostUrl={
        UrlId:this.RandGen(),
        LongUrl:this.m['url'].value,
        CreatedDate:new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 19),
        UserId:this.info.id
      };
      this._apiservice.addUrl(payload)
      .subscribe(
        (response:boolean)=>{
          if(response){
            this.form.patchValue({result:`bit.ly/${payload.UrlId}`});
          }
        },
        (e)=>{
          console.log(e.error);
        }
      );
    }
  };
  clear = () => {
    this.form.reset();
  };
}
