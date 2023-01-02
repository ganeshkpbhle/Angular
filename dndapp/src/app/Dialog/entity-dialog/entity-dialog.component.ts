import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';
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
  CheckBoxControl,
  Control_Key_Desc,
  FormDesc,
  GenericControl,
  Group_Check_Box,
  Group_Input,
  Group_Radio,
  InputControl,
  NestedTabControl,
  RadioControl,
  RangeSliderControl,
  SelectControl,
  SliderControl,
  TabbedControlDesc,
  TabbedControls,
} from 'src/app/shared/formdesc';
import {
  DialogInput,
  DraggableListItem,
  DropListItem,
} from 'src/app/shared/template';
import { minSelectedCheckboxes } from 'src/app/validators/required-check-box-validator';

@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css'],
})
export class EntityDialogComponent implements OnInit {
  dlgGroup: FormGroup;
  onsaveData: EventEmitter<Array<FormDesc>> = new EventEmitter<
    Array<FormDesc>
  >();
  desc_copy: Array<FormDesc> = [];
  dropped_list_index: number;
  constructor(
    private formbuilder: FormBuilder,
    public dialogRef: MatDialogRef<EntityDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogInput,
    private bind_service: ControlBindService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.dropped_list_index = data.form_desc.findIndex(
      (items) => items.id === data.cont_id
    );
    this.dlgGroup = new FormGroup({});
    this.load_Form_Controls(data);
    dialogRef.disableClose = true;
  }

  //General Handlers and desc methods for controls Outside tab
  onCheckChange = (row: number, ctrl_key: Control_Key_Desc) => {
    this.setCurrForm_To_Desc();
    this.bind_service.checkboxChange(
      this.data.cont_id,
      this.data.form_desc,
      ctrl_key,
      this.dropped_list_index
    );
    this.data.form_desc[this.dropped_list_index].desc = this.desc_copy;
    this.load_Form_Controls(this.data);
  };
  writeRangeSliderChange = (
    change: ChangeContext,
    ctrl_desc: GenericControl,
    row: number
  ) => {
    var slider_ctrl: GenericControl = <GenericControl>(
      this.desc_copy[row].find((ctrl) => ctrl.key === ctrl.key)
    );
    switch (slider_ctrl.type) {
      case 'range-slider':
        if (change.value && change.highValue) {
          slider_ctrl.range = [change.value, change.highValue];
        }
        break;
      case 'slider':
        if (change.value) {
          slider_ctrl.value = change.value;
        }
        break;
    }
    this.dlgGroup.controls[ctrl_desc.key].markAsDirty();
  };
  getTabDesc = (
    ctrl_key: Control_Key_Desc
  ): {
    tab_desc: TabbedControls;
    tab_ctrls: Array<NestedTabControl[][]>;
  } => {
    var tab_desc: TabbedControls = <TabbedControls>(
      this.flat_control_list.find((ctrl) => ctrl.key === ctrl_key)
    );
    var tab_ctrls: Array<NestedTabControl[][]> = [];
    tab_desc.tab_labels.forEach((tab) => {
      var ctrls: Array<TabbedControlDesc> = tab_desc.controls.filter(
        (tab_ctrl) => tab_ctrl.group.label === tab
      );
      var max_index: number = Math.max(
        ...ctrls.map((ctrl) => ctrl.group.grp),
        -1
      );
      var group: NestedTabControl[][] = [];
      [...Array(max_index + 1).keys()].forEach((grp_index) => {
        group.push(
          ctrls
            .filter((ctrl) => ctrl.group.grp === grp_index)
            .map((ctrl) => ctrl.control)
        );
      });
      tab_ctrls.push(group);
    });
    return { tab_desc, tab_ctrls };
  };
  //General Handlers and desc methods for controls Inside tab
  getSliderCtrlDescForTab = (
    ctrl_desc: NestedTabControl,
    tab_ctrl_key: Control_Key_Desc
  ): RangeSliderControl | SliderControl | undefined => {
    switch (ctrl_desc.type) {
      case 'range-slider':
        return <RangeSliderControl>(
          this.flat_control_list.find(
            (ctrl) => ctrl.key === ctrl_desc.key && ctrl.type === 'range-slider'
          )
        );
      case 'slider':
        return <SliderControl>(
          this.flat_control_list.find(
            (ctrl) => ctrl.key === ctrl_desc.key && ctrl.type === 'slider'
          )
        );
      default:
        return;
    }
  };


  onCheckChange_tab = (row: number, ctrl_key: Control_Key_Desc) => {
    this.setCurrForm_To_Desc();
    this.bind_service.checkboxChange(
      this.data.cont_id,
      this.data.form_desc,
      ctrl_key,
      this.dropped_list_index
    );
    this.data.form_desc[this.dropped_list_index].desc = this.desc_copy;
    this.load_Form_Controls(this.data);
  };
  writeRangeSliderChange_tab = (
    change: ChangeContext,
    ctrl_desc: GenericControl,
    row: number
  ) => {
    var slider_ctrl: GenericControl = <GenericControl>(
      this.desc_copy[row].find((ctrl) => ctrl.key === ctrl.key)
    );
    switch (slider_ctrl.type) {
      case 'range-slider':
        if (change.value && change.highValue) {
          slider_ctrl.range = [change.value, change.highValue];
        }
        break;
      case 'slider':
        if (change.value) {
          slider_ctrl.value = change.value;
        }
        break;
    }
    this.dlgGroup.controls[ctrl_desc.key].markAsDirty();
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
  setCurrForm_To_Desc = () => {
    for (var i = 0; i < this.desc_copy.length; i++) {
      for (var j = 0; j < this.desc_copy[i].length; j++) {
        var ctrl_desc: GenericControl = this.desc_copy[i][j];
        switch (ctrl_desc.type) {
          case 'input':
            var input_result: string[] =
              this.dlgGroup.controls[ctrl_desc.key.toString()].value;
            for (let index = 0; index < input_result.length; index++) {
              ctrl_desc.grp_list[index].value = input_result[index];
            }
            break;
          case 'select':
            ctrl_desc.option =
              this.dlgGroup.controls[ctrl_desc.key.toString()].value;
            break;
          case 'check':
            var check_result: boolean[] =
              this.dlgGroup.controls[ctrl_desc.key.toString()].value;
            for (let index = 0; index < check_result.length; index++) {
              ctrl_desc.grp_list[index].checked = check_result[index];
            }
            break;
          case 'radio':
            ctrl_desc.grp_items.value =
              this.dlgGroup.controls[ctrl_desc.key.toString()].value;
        }
      }
    }
    this.data.form_desc[this.dropped_list_index].desc = this.desc_copy;
  };
  load_Form_Controls = (data: DialogInput) => {
    this.desc_copy = [];
    this.dlgGroup = this.formbuilder.group({});

    for (
      var i = 0;
      i < data.form_desc[this.dropped_list_index].desc.length;
      i++
    ) {
      if (!this.desc_copy[i]) {
        this.desc_copy[i] = [];
      }
      data.form_desc[this.dropped_list_index].desc[i].forEach((ctrl) => {
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
              dyn_desc: ctrl.dyn_desc,
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
              dyn_desc: ctrl.dyn_desc,
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
              dyn_desc: ctrl.dyn_desc,
            });
            break;
          case 'radio':
            this.dlgGroup.addControl(
              ctrl.key.toString(),
              new FormControl(
                ctrl.grp_items.value,
                this.getValidators(ctrl.validators)
              )
            );
            this.desc_copy[i].push({
              type: 'radio',
              key: ctrl.key,
              label: ctrl.label,
              validators: ctrl.validators,
              grp_items: ctrl.grp_items,
              class: ctrl.class,
              bindevent: ctrl.bindevent,
              dyn_desc: ctrl.dyn_desc,
            });
            break;
          case 'range-slider':
            this.dlgGroup.addControl(
              ctrl.key.toString(),
              new FormControl(ctrl.range, this.getValidators(ctrl.validators))
            );
            this.desc_copy[i].push({
              type: 'range-slider',
              key: ctrl.key,
              label: ctrl.label,
              bindevent: ctrl.bindevent,
              class: ctrl.class,
              dyn_desc: ctrl.dyn_desc,
              min: ctrl.min,
              max: ctrl.max,
              range: ctrl.range,
              validators: ctrl.validators,
            });
            break;
          case 'slider':
            this.dlgGroup.addControl(
              ctrl.key.toString(),
              new FormControl(ctrl.value)
            );
            this.desc_copy[i].push({
              type: 'slider',
              key: ctrl.key,
              label: ctrl.label,
              bindevent: ctrl.bindevent,
              class: ctrl.class,
              dyn_desc: ctrl.dyn_desc,
              min: ctrl.min,
              max: ctrl.max,
              value: ctrl.value,
              validators: ctrl.validators,
            });
            break;
          case 'mat-tab':
            var inner_ctrls: Array<TabbedControlDesc> = [];
            ctrl.tab_labels.forEach((tab) => {
              var form_grp = this.formbuilder.group({});
              ctrl.controls
                .filter((ctrl) => ctrl.group.label === tab)
                .forEach((inner_ctrl) => {
                  switch (inner_ctrl.control.type) {
                    case 'input':
                      var inp_arr: FormArray = this.formbuilder.array([]);
                      inner_ctrl.control.grp_list.forEach((inp) => {
                        inp_arr.push(
                          new FormControl(
                            inp.value,
                            this.getValidators(inp.validators)
                          )
                        );
                      });
                      form_grp.addControl(
                        inner_ctrl.control.key.toString(),
                        inp_arr
                      );
                      inner_ctrls.push({
                        group: { label: tab, grp: inner_ctrl.group.grp },
                        control: {
                          type: 'input',
                          key: inner_ctrl.control.key,
                          label: inner_ctrl.control.label,
                          required: inner_ctrl.control.required,
                          bindevent: inner_ctrl.control.bindevent,
                          grp_list: JSON.parse(
                            JSON.stringify(inner_ctrl.control.grp_list)
                          ),
                          class: inner_ctrl.control.class,
                          dyn_desc: inner_ctrl.control.dyn_desc,
                        },
                      });
                      break;
                    case 'select':
                      form_grp.addControl(
                        inner_ctrl.control.key.toString(),
                        new FormControl(
                          inner_ctrl.control.option,
                          this.getValidators(inner_ctrl.control.validators)
                        )
                      );
                      inner_ctrls.push({
                        group: { label: tab, grp: inner_ctrl.group.grp },
                        control: {
                          type: 'select',
                          key: inner_ctrl.control.key,
                          label: inner_ctrl.control.label,
                          validators: inner_ctrl.control.validators,
                          required: inner_ctrl.control.required,
                          option: inner_ctrl.control.option,
                          options: [...inner_ctrl.control.options],
                          bindevent: inner_ctrl.control.bindevent,
                          dyn_desc: inner_ctrl.control.dyn_desc,
                        },
                      });
                      break;
                    case 'check':
                      var check_arr: FormArray = this.formbuilder.array(
                        [],
                        minSelectedCheckboxes(inner_ctrl.control.mincheck)
                      );
                      inner_ctrl.control.grp_list.forEach((check_box) => {
                        check_arr.push(new FormControl(check_box.checked));
                      });
                      form_grp.addControl(
                        inner_ctrl.control.key.toString(),
                        check_arr
                      );
                      inner_ctrls.push({
                        group: { label: tab, grp: inner_ctrl.group.grp },
                        control: {
                          type: 'check',
                          key: inner_ctrl.control.key,
                          label: inner_ctrl.control.label,
                          validators: inner_ctrl.control.validators,
                          required: inner_ctrl.control.required,
                          grp_list: JSON.parse(
                            JSON.stringify(inner_ctrl.control.grp_list)
                          ),
                          mincheck: inner_ctrl.control.mincheck,
                          class: inner_ctrl.control.class,
                          bindevent: inner_ctrl.control.bindevent,
                          dyn_desc: inner_ctrl.control.dyn_desc,
                        },
                      });
                      break;
                    case 'radio':
                      form_grp.addControl(
                        inner_ctrl.control.key.toString(),
                        new FormControl(
                          inner_ctrl.control.grp_items.value,
                          this.getValidators(inner_ctrl.control.validators)
                        )
                      );
                      inner_ctrls.push({
                        group: { label: tab, grp: inner_ctrl.group.grp },
                        control: {
                          type: 'radio',
                          key: inner_ctrl.control.key,
                          label: inner_ctrl.control.label,
                          validators: inner_ctrl.control.validators,
                          grp_items: inner_ctrl.control.grp_items,
                          class: inner_ctrl.control.class,
                          bindevent: inner_ctrl.control.bindevent,
                          dyn_desc: inner_ctrl.control.dyn_desc,
                        },
                      });
                      break;
                    case 'range-slider':
                      form_grp.addControl(
                        inner_ctrl.control.key.toString(),
                        new FormControl(
                          inner_ctrl.control.range,
                          this.getValidators(inner_ctrl.control.validators)
                        )
                      );
                      inner_ctrls.push({
                        group: { label: tab, grp: inner_ctrl.group.grp },
                        control: {
                          type: 'range-slider',
                          key: inner_ctrl.control.key,
                          label: inner_ctrl.control.label,
                          bindevent: inner_ctrl.control.bindevent,
                          class: inner_ctrl.control.class,
                          dyn_desc: inner_ctrl.control.dyn_desc,
                          min: inner_ctrl.control.min,
                          max: inner_ctrl.control.max,
                          range: inner_ctrl.control.range,
                          validators: inner_ctrl.control.validators,
                        },
                      });
                      break;
                    case 'slider':
                      form_grp.addControl(
                        inner_ctrl.control.key.toString(),
                        new FormControl(inner_ctrl.control.value)
                      );
                      inner_ctrls.push({
                        group: { label: tab, grp: inner_ctrl.group.grp },
                        control: {
                          type: 'slider',
                          key: inner_ctrl.control.key,
                          label: inner_ctrl.control.label,
                          bindevent: inner_ctrl.control.bindevent,
                          class: inner_ctrl.control.class,
                          dyn_desc: inner_ctrl.control.dyn_desc,
                          min: inner_ctrl.control.min,
                          max: inner_ctrl.control.max,
                          value: inner_ctrl.control.value,
                          validators: inner_ctrl.control.validators,
                        },
                      });
                      break;
                  }
                });
              this.dlgGroup.addControl(tab, form_grp);
            });
            this.desc_copy[i].push({
              type: 'mat-tab',
              key: ctrl.key,
              label: ctrl.label,
              tab_labels: ctrl.tab_labels,
              class: ctrl.class,
              dyn_desc: ctrl.dyn_desc,
              controls: inner_ctrls,
            });
            break;
        }
      });
    }
  };

  public get flat_control_list(): FormDesc {
    return this.desc_copy.reduce(function (prev, curr) {
      return prev.concat(curr);
    });
  }

  public get IsFormValid(): boolean {
    return this.dlgGroup.valid;
  }
  ngOnInit(): void {
    this.flat_control_list.forEach((ctrl) => {
      if (ctrl.type === 'range-slider') {
        this.dlgGroup
          .get(ctrl.key.toString())
          ?.valueChanges.subscribe(() => this.changeDetectorRef.markForCheck());
      }
    });
  }
}
