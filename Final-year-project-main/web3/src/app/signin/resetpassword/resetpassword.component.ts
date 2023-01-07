import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MoralisService } from '../../Shared/services/moralis.service';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  form:FormGroup;
  text:string="";
  constructor(private _moralis:MoralisService,private dialogRef:MatDialogRef<ResetpasswordComponent>) { 
    this.form=new FormGroup({
      email:new FormControl("",[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
    });
  }
  public get m(): FormGroup['controls'] {
    return this.form.controls
  }
  ngOnInit(): void {
  }
  Submit=()=>{
    if(this.form.valid){
      this._moralis.resetPassword(this.form.controls['email'].value)
      .then((response:any)=>{
        console.log(response);
        this.dialogRef.close();
      })
      .catch(
        (err)=>{
          console.log(err?.code);
        }
      );
    }
  }
  closeDialog=()=>{
    this.dialogRef.close();
  };
}
