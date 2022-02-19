import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { _SignIn } from '../shared/data_layout';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  constructor(private apiservice: ApiService,private route:Router) {
    this.form = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl(""),
      email: new FormControl("", [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      mobile: new FormControl("", [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      passwd: new FormControl("", [Validators.required, Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])
    });
  }

  ngOnInit(): void {
  }

  public get m(): FormGroup['controls'] {
    return this.form.controls
  }
  submit = () => {
    if (this.form.valid) {
      this.apiservice.getUserBymail(this.m['email'].value)
      .subscribe(
        (response)=>{
          if(typeof response === 'boolean' && response){
            const payload: _SignIn = {
              GId: this.m['email'].value + this.m['mobile'].value,
              FirstName: this.m['firstName'].value,
              LastName: this.m['lastName'].value,
              Mobile:this.m['mobile'].value,
              Email:this.m['email'].value,
              EmailVerified:0,
              SnType:'email/pass',
              Passwd:this.m['passwd'].value
            };
            this.apiservice.addUser(payload)
            .subscribe(
              (result:number)=>{
                if(result===1){
                  this.route.navigate(["/login"]);
                }
              }
            );
          }
          else{
            alert("User with Email already exists");
          }
        },
        (e)=>{
          console.log(e.error);
        }
      );
    }
  };
}
