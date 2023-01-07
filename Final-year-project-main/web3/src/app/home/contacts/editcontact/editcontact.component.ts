import { Component, Inject, OnInit, Optional, AfterContentInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Moralis from 'moralis/types';
import { Contacts, InvitesData, PostFriend } from 'src/app/Shared/data-layout';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { environment } from 'src/environments/environment';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editcontact',
  templateUrl: './editcontact.component.html',
  styleUrls: ['./editcontact.component.css']
})
export class EditcontactComponent implements OnInit {
  @Output() nameChange:EventEmitter<{index:number,name:string}>=new EventEmitter<{index:number,name:string}>();
  card: Contacts;
  form: FormGroup;
  savingName:boolean=false;
  dpUrl: string = environment.dicebear;
  errtxt:string="";
  constructor(private fb: FormBuilder, private _moralis: MoralisService, private dialogRef: MatDialogRef<EditcontactComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.card = data.card;
    this.form = fb.group({
      name: new FormControl(this.card.name, [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
      addresses: fb.array([])
    });
    this.namectrl.markAsDirty();
    this.namectrl.markAsTouched();
    this.card.accounts.forEach((e) => {
      this.getControls().push(this.fb.group({
        address: new FormControl(e.address, [Validators.required, Validators.minLength(42), Validators.maxLength(42)])
      }));
    });
  }
  ngOnInit(): void {
  };
  getControls() {
    return this.form.get('addresses') as FormArray;
  };
  newControl = (): FormGroup => {
    return this.fb.group({
      address: new FormControl("", [Validators.required, Validators.minLength(42), Validators.maxLength(42)])
    });
  };
  get namectrl(){
    return this.form.controls['name'];
  }
  removeControl = (index: number) => {
    this.getControls().removeAt(index);
    if (index < this.card.accounts.length) {
      this.card.accounts = this.card.accounts.filter((e,i)=>{
        return index!==i
      });
    }
  };
  submit = async () => {
    const param: PostFriend = {name:this.card.actualName,nickname:this.card.name,fromAddr:"",tgtName:""};
    this._moralis.postRequest(param)
    .then(
      (response:boolean|{})=>{
        if(!response){
          this.errtxt="Request already pending";
        }
        else{
          this._moralis.fetchInvites().then(
            (response:InvitesData) => {
              this._moralis.InvitesChange.emit(response);
            
            }
          );;
          this.Close();
        }
      }
    );
  };
  updateNickName=()=>{
    if(this.namectrl.valid){
      this.savingName=true;
      this._moralis.updateName({id:this.card.contactId,nick:this.namectrl.value})
      .then(
        ()=>{
          this.card.name=this.namectrl.value;
          this.savingName=false;
          this.nameChange.emit({index:this.data.ind,name:this.namectrl.value});
        }
      );
    }
  }
  Close = () => {
    this.dialogRef.close();
  };
  
}
