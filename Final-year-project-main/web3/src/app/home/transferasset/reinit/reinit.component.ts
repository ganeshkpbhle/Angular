import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reinit',
  templateUrl: './reinit.component.html',
  styleUrls: ['./reinit.component.css']
})
export class ReinitComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ReinitComponent>) { }

  ngOnInit(): void {
  }
  Close=()=>{
    this.dialogRef.close();
  }
}
