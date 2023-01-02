import { Pipe, PipeTransform } from '@angular/core';
import {
  CheckBoxControl,
  Check_Options,
  Control_Key_Desc,
  FormDesc,
  GenericControl,
  InputControl,
  Input_Options,
  NestedTabControl,
  RadioControl,
  RadioOptions,
  RangeSliderControl,
  SelectControl,
  SelectOptions,
  SliderControl,
  TabbedControlDesc,
  TabbedControls,
  TabControlDesc,
} from '../../formdesc';
@Pipe({
  name: 'inputopt',
})
export class InputOptionsPipe implements PipeTransform {
  transform(
    ctrl_key: Control_Key_Desc,
    desc_copy: FormDesc[],
    tab_ctrl_key?: Control_Key_Desc, 
    tab_label?: string 
  ): Input_Options {
    var flat_control_list: FormDesc = desc_copy.reduce(function (prev, curr) {
      return prev.concat(curr);
    });
    if (tab_ctrl_key && tab_label) {
      var tab: TabbedControls = <TabbedControls>(
        flat_control_list.find(
          (e) => e.key === tab_ctrl_key && e.type === 'mat-tab'
        )
      );
      var inputs: InputControl = <InputControl>tab.controls
        .filter((tab_ctrl) => tab_ctrl.group.label === tab_label)
        .map((tab_ctrl) => tab_ctrl.control)
        .find(
          (inner_ctrl) =>
            inner_ctrl.key === ctrl_key && inner_ctrl.type === 'input'
        );
      return { class: inputs.class, list: inputs.grp_list };
    } else {
      var opts: InputControl = <InputControl>(
        flat_control_list.find((e) => e.key === ctrl_key)
      );
      return { class: opts.class, list: opts.grp_list };
    }
  }
}
@Pipe({
  name: 'radopt',
})
export class RadioOptionsPipe implements PipeTransform {
  transform(
    ctrl_key: Control_Key_Desc,
    desc_copy: FormDesc[],
    tab_ctrl_key?: Control_Key_Desc, 
    tab_label?: string 
  ): RadioOptions {
    var flat_control_list: FormDesc = desc_copy.reduce(function (prev, curr) {
      return prev.concat(curr);
    });
    if (tab_ctrl_key && tab_label) {
      var tab: TabbedControls = <TabbedControls>(
        flat_control_list.find(
          (e) => e.key === tab_ctrl_key && e.type === 'mat-tab'
        )
      );
      var radios: RadioControl = <RadioControl>tab.controls
        .filter((tab_ctrl) => tab_ctrl.group.label === tab_label)
        .map((tab_ctrl) => tab_ctrl.control)
        .find(
          (inner_ctrl) =>
            inner_ctrl.key === ctrl_key && inner_ctrl.type === 'radio'
        );
      return { class: radios.class, radio_grp: radios.grp_items };
    } else {
      var opts: RadioControl = <RadioControl>(
        flat_control_list.find((e) => e.key === ctrl_key)
      );
      return { class: opts.class, radio_grp: opts.grp_items };
    }
  }
}
@Pipe({
  name: 'checkopt',
})
export class CheckOptionsPipe implements PipeTransform {
  transform(
    ctrl_key: Control_Key_Desc,
    desc_copy: FormDesc[],
    tab_ctrl_key?: Control_Key_Desc, 
    tab_label?: string 
  ): Check_Options {
    var flat_control_list: FormDesc = desc_copy.reduce(function (prev, curr) {
      return prev.concat(curr);
    });
    if (tab_ctrl_key && tab_label) {
      var tab: TabbedControls = <TabbedControls>(
        flat_control_list.find(
          (e) => e.key === tab_ctrl_key && e.type === 'mat-tab'
        )
      );
      var checks: CheckBoxControl = <CheckBoxControl>tab.controls
        .filter((tab_ctrl) => tab_ctrl.group.label === tab_label)
        .map((tab_ctrl) => tab_ctrl.control)
        .find(
          (inner_ctrl) =>
            inner_ctrl.key === ctrl_key && inner_ctrl.type === 'check'
        );
      return { class: checks.class, list: checks.grp_list };
    } else {
      var opts: CheckBoxControl = <CheckBoxControl>(
        flat_control_list.find((e) => e.key === ctrl_key)
      );
      return { class: opts.class, list: opts.grp_list };
    }
  }
}
@Pipe({
  name: 'selectopt',
})
export class SelectOptionsPipe implements PipeTransform {
  transform(
    ctrl_key: Control_Key_Desc,
    desc_copy: FormDesc[],
    tab_ctrl_key?: Control_Key_Desc, 
    tab_label?: string 
  ): SelectOptions {
    var flat_control_list: FormDesc = desc_copy.reduce(function (prev, curr) {
      return prev.concat(curr);
    });
    if (tab_ctrl_key && tab_label) {
      var tab: TabbedControls = <TabbedControls>(
        flat_control_list.find(
          (e) => e.key === tab_ctrl_key && e.type === 'mat-tab'
        )
      );
      var opts: SelectControl = <SelectControl>tab.controls
        .filter((tab_ctrl) => tab_ctrl.group.label === tab_label)
        .map((tab_ctrl) => tab_ctrl.control)
        .find(
          (inner_ctrl) =>
            inner_ctrl.key === ctrl_key && inner_ctrl.type === 'select'
        );
      return opts.options;
    } else {
      var opts: SelectControl = <SelectControl>(
        flat_control_list.find((e) => e.key === ctrl_key)
      );
      return opts.options;
    }
  }
}

@Pipe({
  name: 'sliderdesc',
})
export class SilderDescPipe implements PipeTransform{
  transform(ctrl_desc:GenericControl,desc_copy:FormDesc[]):RangeSliderControl | SliderControl | undefined {
    var flat_control_list: FormDesc = desc_copy.reduce(function (prev, curr) {
      return prev.concat(curr);
    });
    switch (ctrl_desc.type) {
      case 'range-slider':
        return <RangeSliderControl>(
          flat_control_list.find(
            (ctrl) => ctrl.key === ctrl_desc.key && ctrl.type === 'range-slider'
          )
        );
      case 'slider':
        return <SliderControl>(
          flat_control_list.find(
            (ctrl) => ctrl.key === ctrl_desc.key && ctrl.type === 'slider'
          )
        );
      default:
        return;
    }
  }
}
@Pipe({
  name: 'tabdesc',
})
export class TabDescPipe implements PipeTransform{
  transform(ctrl_key: Control_Key_Desc, desc_copy:FormDesc[]):TabControlDesc {
    var flat_control_list: FormDesc = desc_copy.reduce(function (prev, curr) {
      return prev.concat(curr);
    });
    var tab_desc: TabbedControls = <TabbedControls>(
      flat_control_list.find((ctrl) => ctrl.key === ctrl_key)
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
  }
}