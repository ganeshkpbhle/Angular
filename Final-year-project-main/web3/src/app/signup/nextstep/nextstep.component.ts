import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
@Component({
  selector: 'app-nextstep',
  templateUrl: './nextstep.component.html',
  styleUrls: ['./nextstep.component.css']
})
export class NextstepComponent implements OnInit {
  form:FormGroup;
  constructor(private _moralis:MoralisService,private _router:Router,private _route:ActivatedRoute) {
    this.form=new FormGroup({
      username:new FormControl("",[Validators.required,Validators.minLength(6)]),
      email:new FormControl("",[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      mobile:new FormControl("",[Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      passwd:new FormControl("",[Validators.required,Validators.minLength(8),Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])
    });
  }
  public get m(): FormGroup['controls'] {
    return this.form.controls
  }
  ngOnInit(): void {
    
  }
  remove = () => {
    this._moralis.removeWallet()
    .then(
      ()=>{
        this._router.navigate(["../connect"],{relativeTo:this._route});
      }
    );
  };
  Submit=()=>{
    this._moralis.SignUp(this.form.value)
    .then(
      ()=>{
        this._router.navigate(["/home"],{relativeTo:this._route.parent});
      },
      (err)=>{
        console.log(err?.message);
      }
    );
  }
  
}
