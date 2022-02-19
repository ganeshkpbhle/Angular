import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { _Login, _LoginResponse } from '../shared/data_layout';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(private api_service:ApiService,private route:Router) {
    this.form = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      passwd: new FormControl("", [Validators.required])
    });
  }
  public get m(): FormGroup['controls'] {
    return this.form.controls
  }
  ngOnInit(): void {
  }
  submit=()=>{
    if(this.form.valid){
      const payload:_Login={ Uemail:this.m['email'].value,Passwd:this.m['passwd'].value };
      this.api_service.logIn(payload)
      .subscribe(
        (response:_LoginResponse)=>{
          localStorage.setItem("user",JSON.stringify(response));
          this.route.navigate(["/home"]);
        },
        (e)=>{
          console.log(e);
        }
      );
    }
  };
}
