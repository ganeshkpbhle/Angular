import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Moralis from 'moralis/types';
import { InvitesData, PostFriend, Search_User } from 'src/app/Shared/data-layout';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { ResetpasswordComponent } from 'src/app/signin/resetpassword/resetpassword.component';

@Component({
  selector: 'app-newcontact',
  templateUrl: './newcontact.component.html',
  styleUrls: ['./newcontact.component.css']
})
export class NewcontactComponent implements OnInit {
  form: FormGroup;
  userVerified:boolean=false;
  errtxt:string="";
  constructor(private fb: FormBuilder, private _moralis: MoralisService, private dialogRef: MatDialogRef<ResetpasswordComponent>) {
    this.form = fb.group({
      nickname: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
      name:new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(32)])
    });
  };
  ngOnInit(): void {
  }
  submit = () => {
    const param: PostFriend = this.form.value;
    this._moralis.postRequest(param)
    .then(
      (response:boolean|{})=>{
        if(!response){
          this.errtxt="Request already pending for this friend";
        }
        else{
          this._moralis.fetchInvites().then(
            (response:InvitesData) => {
              this._moralis.InvitesChange.emit(response);
              this.Close();
            }
          );;
        }
      }
    );
  };
  get ctrls(){
    return this.form.controls;
  }
  Close = () => {
    this.dialogRef.close();
  };
  searchUser=async()=>{
    const param:Search_User={name:this.ctrls['name'].value};
    const response:string|Moralis.Object=await this._moralis.getUser(param);
    if(response===null){
      this.ctrls['name'].setErrors({
        notexist:true
      });
    }
    else if(response==="sameuser"){
      this.ctrls['name'].setErrors({
        sameuser:true
      });
    }
    else if(response==="avail"){
      this.userVerified=true;
    }
    else{
      this.ctrls['name'].setErrors({
        friend:true
      });
    }
  };
  focus=()=>{
   this.userVerified=false;
  }
}
