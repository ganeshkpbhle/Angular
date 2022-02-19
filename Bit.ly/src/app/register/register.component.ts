import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators } from "@angular/forms";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form:FormGroup;
  constructor() {
    this.form=new FormGroup({
      firstName:new FormControl("",[Validators.required]),
      lastName:new FormControl(""),
      email:new FormControl("",[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      mobile:new FormControl("",[Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
      passwd:new FormControl("",[Validators.required,Validators.minLength(8),Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])
    });
   }

  ngOnInit(): void {
  }
  
  public get m():FormGroup['controls']{
    return this.form.controls
  }
  
}
