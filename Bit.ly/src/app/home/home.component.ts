import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { _LoginResponse, _UserInfo } from '../shared/data_layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userInfo:_UserInfo|undefined;
  constructor(private _apiservice:ApiService) { }

  ngOnInit(): void {
    const store:string|null=localStorage.getItem("user");
    if(store!==null){
      const user:_LoginResponse=JSON.parse(store);
      this._apiservice.getUserSimple(user.id)
      .subscribe(
        (response:_UserInfo)=>{
          this.userInfo=response;
          this._apiservice.setUserInfo(response);
        },
        (e)=>{
          console.log(e.error);
        }
      );
    }
  }

}
