import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AcctFill, _ConfirmInvite } from 'src/app/Shared/data-layout';
import { MoralisService } from 'src/app/Shared/services/moralis.service';

@Component({
  selector: 'app-confirm-invite',
  templateUrl: './confirm-invite.component.html',
  styleUrls: ['./confirm-invite.component.css']
})
export class ConfirmInviteComponent implements OnInit {
  @Output() res: EventEmitter<_ConfirmInvite> = new EventEmitter<_ConfirmInvite>();
  acctArr: Array<AcctFill> = [];
  form: FormGroup;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ConfirmInviteComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    , private _moralis: MoralisService) {
    this.form = fb.group({
      fnickname: new FormControl(data.name, [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
      address: fb.control(null, [Validators.required])
    });
    this.acctArr = data.accts;
  }
  ngOnInit(): void {
  }
  submit = () => {
    if (this.form.valid && this.form.controls['address'].value.length !== 0) {
      const selectedAccts: Array<string> = [];
      this.form.controls['address'].value?.forEach((ele: number) => {
        selectedAccts.push(this.acctArr[ele].acct);
      });
      this.res.emit({ fnick: this.form.controls['fnickname'].value, selectedAccts });
      setTimeout(() => {
        this.Close();
      }, 200);
    }
  }
  Close = () => {
    this.dialogRef.close();
  };
  
}
