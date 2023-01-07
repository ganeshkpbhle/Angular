import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-initsuccess',
  templateUrl: './initsuccess.component.html',
  styleUrls: ['./initsuccess.component.css']
})
export class InitsuccessComponent implements OnInit {
  hash:string="";
  @Output() redirect:EventEmitter<string>=new EventEmitter<string>();
  constructor(private dialogRef: MatDialogRef<InitsuccessComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.hash=data.hash;
  }
  Stats=()=>{
    this.redirect.emit('stats');
    this.dialogRef.close();
  };
  ngOnInit(): void {
  };
  close=()=>{
    this.dialogRef.close();
  };
}
