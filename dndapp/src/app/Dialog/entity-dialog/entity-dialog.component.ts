import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeContext } from 'ng5-slider/change-context';
import { ControlBindService } from 'src/app/services/control-bind.service';
import {
  Control_Key_Desc,
  FormDesc,
  GenericControl,
  Group_Check_Box,
  Group_Input,
  Group_Radio,
  SliderControl,
} from 'src/app/shared/formdesc';
import { DialogInput } from 'src/app/shared/template';
import { minSelectedCheckboxes } from 'src/app/validators/required-check-box-validator';

@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css'],
})
export class EntityDialogComponent implements OnInit {
  dlgGroup: FormGroup;
  onsaveData: EventEmitter<Array<FormDesc>> = new EventEmitter<Array<FormDesc>>();
  desc_copy: Array<FormDesc> = [];
  constructor(
    private formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<EntityDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:DialogInput,
    private bind_service: ControlBindService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.dlgGroup=new FormGroup({});
    this.load_Form_Controls(data);
    dialogRef.disableClose = true;
  }
  getSliderCtrlDesc=(ctrl_key:Control_Key_Desc):SliderControl =>{
    return <SliderControl>this.flat_control_list.find(ctrl => ctrl.key===ctrl_key && ctrl.type==='slider');
  }
  select_options = (ctrl_key: Control_Key_Desc): string[] => {
    var opts:GenericControl|undefined = this.desc_copy
      .reduce(function (prev, curr) {
        return prev.concat(curr);
      })
      .find((e) => e.key === ctrl_key);
    if (opts && opts.type === 'select') {
      return opts.options;
    }
    return [];
  };
  checkbox_list = (
    ctrl_key: Control_Key_Desc
  ): { class: string; list: Array<Group_Check_Box> } => {
    var checks: GenericControl | undefined = this.flat_control_list.find((e) => e.key === ctrl_key);
    if (checks && checks.type === 'check') {
      return { class: checks.class, list: checks.grp_list };
    }
    return { class: '', list: [] };
  };
  input_list = (
    ctrl_key: Control_Key_Desc
  ): { class: string; list: Array<Group_Input> } => {
    var inputs: GenericControl | undefined = this.flat_control_list.find((e) => e.key === ctrl_key);
    if (inputs && inputs.type === 'input') {
      return { class: inputs.class, list: inputs.grp_list };
    }
    return { class: '', list: [] };
  };
  radio_list=(
    ctrl_key: Control_Key_Desc
  ): { class: string; radio_grp:Group_Radio } => {
    var radios: GenericControl | undefined = this.flat_control_list.find((e) => e.key === ctrl_key);
    if (radios && radios.type === 'radio') {
      return { class: radios.class, radio_grp: radios.grp_items };
    }
    return { class: '', radio_grp: {options:[],value:-1} };
  };
  closeDialog = () => {
    this.dialogRef.close();
  };
  submit = () => {
    if (this.dlgGroup.valid) {
      this.setCurrForm_To_Desc();
      this.onsaveData.emit(this.desc_copy);
      this.dialogRef.close();
    }
  };
  getValidators(validators: string[]): ValidatorFn[] {
    var validators_funs: ValidatorFn[] = [];
    validators.forEach((key) => {
      switch (key) {
        case 'required':
          validators_funs.push(Validators.required);
          break;
        default:
          break;
      }
    });
    return validators_funs;
  }
  onCheckChange = (row: number,ctrl_key: Control_Key_Desc) => {
    this.setCurrForm_To_Desc();
    this.bind_service.checkboxChange(
      this.data.cont_id,
      this.desc_copy,
      ctrl_key
    );
    this.load_Form_Controls({
      cont_name:this.data.cont_name,
      cont_id:this.data.cont_id,
      form_desc:this.desc_copy
    });
  };
  setCurrForm_To_Desc = () => {
    for(var i=0;i<this.desc_copy.length;i++){
      for(var j=0;j<this.desc_copy[i].length;j++){
        var ctrl_desc: GenericControl =this.desc_copy[i][j];
        switch (ctrl_desc.type) {
          case 'input':
            var input_result: string[] = this.dlgGroup.controls[ctrl_desc.key.toString()].value;
            for (let index = 0; index < input_result.length; index++) {
              ctrl_desc.grp_list[index].value = input_result[index];
            }
            break;
          case 'select':
            ctrl_desc.option = this.dlgGroup.controls[ctrl_desc.key.toString()].value;
            break;
          case 'check':
            var check_result: boolean[] = this.dlgGroup.controls[ctrl_desc.key.toString()].value;
            for (let index = 0; index < check_result.length; index++) {
              ctrl_desc.grp_list[index].checked = check_result[index];
            }
            break;
          case 'radio':
            ctrl_desc.grp_items.value=this.dlgGroup.controls[ctrl_desc.key.toString()].value;
        }
      }
    }
  };
  load_Form_Controls = (data:DialogInput) => {
    this.desc_copy=[];
    this.dlgGroup=this.formbuilder.group({});
    for (var i = 0; i < data.form_desc.length; i++) {
      if (!this.desc_copy[i]) {
        this.desc_copy[i] = [];
      }
      data.form_desc[i].forEach((ctrl)=>{
        switch (ctrl.type) {
          case 'input':
            var inp_arr: FormArray = this.formbuilder.array([]);
            ctrl.grp_list.forEach((inp) => {
              inp_arr.push(
                new FormControl(inp.value, this.getValidators(inp.validators))
              );
            });
            this.dlgGroup.addControl(ctrl.key.toString(), inp_arr);
            this.desc_copy[i].push({
              type: 'input',
              key: ctrl.key,
              label: ctrl.label,
              required: ctrl.required,
              bindevent: ctrl.bindevent,
              grp_list: JSON.parse(JSON.stringify(ctrl.grp_list)),
              class: ctrl.class,
              dyn_desc:ctrl.dyn_desc
            });
            break;
          case 'select':
            this.dlgGroup.addControl(
              ctrl.key.toString(),
              new FormControl(ctrl.option, this.getValidators(ctrl.validators))
            );
            this.desc_copy[i].push({
              type: 'select',
              key: ctrl.key,
              label: ctrl.label,
              validators: ctrl.validators,
              required: ctrl.required,
              option: ctrl.option,
              options: [...ctrl.options],
              bindevent: ctrl.bindevent,
              dyn_desc:ctrl.dyn_desc
            });
            break;
          case 'check':
            var check_arr: FormArray = this.formbuilder.array(
              [],
              minSelectedCheckboxes(ctrl.mincheck)
            );
            ctrl.grp_list.forEach((check_box) => {
              check_arr.push(new FormControl(check_box.checked));
            });
            this.dlgGroup.addControl(ctrl.key.toString(), check_arr);
            this.desc_copy[i].push({
              type: 'check',
              key: ctrl.key,
              label: ctrl.label,
              validators: ctrl.validators,
              required: ctrl.required,
              grp_list: JSON.parse(JSON.stringify(ctrl.grp_list)),
              mincheck: ctrl.mincheck,
              class: ctrl.class,
              bindevent: ctrl.bindevent,
              dyn_desc:ctrl.dyn_desc
            });
            break;
          case 'radio':
            this.dlgGroup.addControl(ctrl.key.toString(),new FormControl(ctrl.grp_items.value,this.getValidators(ctrl.validators)));
            this.desc_copy[i].push({
              type:'radio',
              key:ctrl.key,
              label:ctrl.label,
              validators:ctrl.validators,
              grp_items:ctrl.grp_items,
              class:ctrl.class,
              bindevent:ctrl.bindevent,
              dyn_desc:ctrl.dyn_desc
            });
            break;
          case 'slider':
            this.dlgGroup.addControl(ctrl.key.toString(),new FormControl(ctrl.range));
            this.desc_copy[i].push({
              type: 'slider',
              key: ctrl.key,
              label: ctrl.label,
              bindevent: ctrl.bindevent,
              class: ctrl.class,
              dyn_desc:ctrl.dyn_desc,
              min:ctrl.min,
              max:ctrl.max,
              range:ctrl.range
            });
            break;
        }
      });
    }
  };
  
  public get flat_control_list() : FormDesc {
    return this.desc_copy
    .reduce(function (prev, curr) {
      return prev.concat(curr);
    })
  }
  
  
  public get IsFormValid():boolean{
    return this.dlgGroup.valid;
  }
  writeSliderChange=(change:ChangeContext,ctrl_key:Control_Key_Desc,row:number)=>{
    var slider_ctrl:SliderControl = <SliderControl>this.desc_copy[row].find(ctrl => ctrl.key===ctrl_key && ctrl.type==='slider');
    if(change.value && change.highValue){
      slider_ctrl.range=[change.value,change.highValue];
    }
  }
  ngOnInit(): void {
    this.flat_control_list.forEach(ctrl =>{
      if(ctrl.type==='slider'){
        this.dlgGroup.get(ctrl.key.toString())?.valueChanges.subscribe(() =>this.changeDetectorRef.markForCheck());
      }
    });
  }
}
