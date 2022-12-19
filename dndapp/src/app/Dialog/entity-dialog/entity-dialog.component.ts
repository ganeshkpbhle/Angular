import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormDesc } from 'src/app/shared/formdesc';

@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css']
})
export class EntityDialogComponent implements OnInit {
  dlgGroup:FormGroup=new FormGroup({});
  constructor(public dialogRef: MatDialogRef<EntityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { desc:FormDesc }) { 
      data.desc.forEach(ctrl =>{
        switch(ctrl.type)
        {
          case 'input':
            this.dlgGroup.addControl(ctrl.key,new FormControl(ctrl.defaultValue,ctrl.validators))
          break;
          case 'select':break;
        }
      });
      dialogRef.disableClose=true;
    }

  ngOnInit(): void {
  }
  // pdtclass = new FormControl('', [Validators.required]);
  // getErrorMessage() {
  //   if (this.pdtclass.hasError('required')) {
  //     return 'Pls enter a value';
  //   }

  //   return this.pdtclass.hasError('pdtclass') ? 'Not a valid Class' : '';
  // }
}
