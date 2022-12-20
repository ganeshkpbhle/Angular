import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormDesc, GenericControl } from 'src/app/shared/formdesc';

@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css'],
})
export class EntityDialogComponent implements OnInit {
  dlgGroup: FormGroup = new FormGroup({});
  onsaveData: EventEmitter<FormDesc> = new EventEmitter<FormDesc>();
  desc_copy: FormDesc = [];
  constructor(
    public dialogRef: MatDialogRef<EntityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { desc: FormDesc }
  ) {
    data.desc.forEach((ctrl) => {
      switch (ctrl.type) {
        case 'input':
          this.dlgGroup.addControl(
            ctrl.key,
            new FormControl(ctrl.value, ctrl.validators)
          );
          this.desc_copy.push({
            type: 'input',
            key: ctrl.key,
            label: ctrl.label,
            validators: ctrl.validators,
            required: ctrl.required,
            value: ctrl.value,
          });
          break;
        case 'select':
          this.dlgGroup.addControl(
            ctrl.key,
            new FormControl(ctrl.option, ctrl.validators)
          );
          this.desc_copy.push({
            type: 'select',
            key: ctrl.key,
            label: ctrl.label,
            validators: ctrl.validators,
            required: ctrl.required,
            option: ctrl.option,
            options: [...ctrl.options],
          });
          break;
      }
    });
    dialogRef.disableClose = true;
  }
  select_options = (ctrl_key: string): string[] => {
    var opts: GenericControl | undefined = this.desc_copy.find(
      (e) => e.key === ctrl_key
    );
    if (opts && opts.type === 'select') {
      return opts.options;
    }
    return [];
  };
  closeDialog = () => {
    this.dialogRef.close();
  };
  submit = () => {
    if (this.dlgGroup.valid) {
      var controls = this.dlgGroup.controls;
      for (const ctrl in controls) {
        var ctrl_index: number = this.desc_copy.findIndex(
          (e) => e.key === ctrl
        );
        var ctrl_desc: GenericControl = { ...this.desc_copy[ctrl_index] };
        switch (ctrl_desc.type) {
          case 'input':
            ctrl_desc.value = controls[ctrl].value;
            break;
          case 'select':
            ctrl_desc.option = controls[ctrl].value;
            break;
        }
        this.desc_copy[ctrl_index] = ctrl_desc;
        this.onsaveData.emit(this.desc_copy);
        this.dialogRef.close();
      }
    }
  };
  ngOnInit(): void {}
}
