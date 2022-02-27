import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { _LoginResponse, _UrlList, _UserInfo } from '../shared/data_layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userInfo?: _UserInfo;
  InProgress: boolean = false;
  constructor(private _apiservice: ApiService, public loader: LoaderService) {
    loader.isLoading.subscribe(
      (result: boolean) => {
        this.InProgress = result;
      }
    );
  }

  ngOnInit(): void {
    const store: string | null = localStorage.getItem("user");
    if (store !== null) {
      const user: _LoginResponse = JSON.parse(store);
      this._apiservice.getUserSimple(user.id)
        .subscribe(
          (response: _UserInfo) => {
            this.userInfo = response;
            this._apiservice.setUserInfo(response);
            this._apiservice.getUrls(response.id)
              .subscribe(
                (response1: Array<_UrlList>) => {
                  this._apiservice.setHistory(response1);
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
  onActivate(componentReference: any) {
    componentReference?.loader?.isLoading.next(true);
  }
}
