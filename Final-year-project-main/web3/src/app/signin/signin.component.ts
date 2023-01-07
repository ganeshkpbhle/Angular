import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { MoralisService } from '../Shared/services/moralis.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  form:FormGroup;
  constructor(private _moralis:MoralisService,private _router:Router,private _route:ActivatedRoute
    ,private dialog:MatDialog) { 
    this.form=new FormGroup({
      username:new FormControl("",[Validators.required,Validators.minLength(6)]),
      passwd:new FormControl("",[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),Validators.minLength(8)])
    });
  }

  ngOnInit(): void {
  }
  public get m(): FormGroup['controls'] {
    return this.form.controls
  }
  Submit=()=>{
    this._moralis.SignIn(this.form.value)
    .then(
      ()=>{
        this._router.navigate(["/home"],{relativeTo:this._route});
      }
    );
  };
  connectWallet=async()=>{
    this._moralis.connect()
    .then(
      (res:boolean)=>{
        if(res){
          this._router.navigate(["/home"],{relativeTo:this._route});
        }
      }
    );
  }
  resetPass=()=>{
    const dialogConfig=new MatDialogConfig();
    dialogConfig.disableClose=true;
    dialogConfig.height="49%";
    dialogConfig.width="56%";
    this.dialog.open(ResetpasswordComponent,dialogConfig);
  };
 
}
