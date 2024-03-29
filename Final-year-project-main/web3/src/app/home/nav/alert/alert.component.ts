import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  acct:string;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AlertComponent>) {
    this.acct=data.acct;
  }

  ngOnInit(): void {
  }
  Close = () => {
    this.dialogRef.close();
  };
}
