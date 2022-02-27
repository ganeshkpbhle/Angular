import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { _UpdateConfirm, _UpdateProf, _UserInfo } from 'src/app/shared/data_layout';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  user?:_UserInfo;
  constructor(private _apiservice: ApiService,private _route:Router,public loader:LoaderService) { 
    this.form = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      mobile: new FormControl("", [Validators.required, Validators.maxLength(10), Validators.minLength(10)])
    });
  }
  public get m(): FormGroup['controls'] {
    return this.form.controls
  }
  ngOnInit(): void {
    this._apiservice.getUserInfo()
    .subscribe(
      (result:_UserInfo)=>{
        this.user=result;
        this.form.setValue({email:result.email,mobile:result.mobile});
        this.loader.isLoading.next(false);
      }
    );
    this._apiservice.UserInfoUpdated.subscribe(
      (result: _UserInfo) => {
        this.user=result;
        this.form.setValue({email:result.email,mobile:result.mobile});
        this.loader.isLoading.next(false);
      }
    );
  }
  submit=()=>{
    if(this.form.valid && this.user){
      this.loader.isLoading.next(true);
      const payload:_UpdateProf={
        Id:this.user.id,
        FirstName:this.user.firstName,
        LastName:this.user.lastName,
        Email:this.m['email'].value,
        Mobile:this.m['mobile'].value
      };
      this._apiservice.updateUser(this.user.id,payload)
      .subscribe(
        (response:_UpdateConfirm)=>{
          if(response.update){
            this.loader.isLoading.next(false);
            this.form.setValue({email:payload.Email,mobile:payload.Mobile});
          }
        }
      );
    }
  };
}
