import { Injectable } from '@angular/core';
import {
  CheckBoxControl,
  Control_Key_Desc,
  FormDesc,
  GenericControl,
  Group_Check_Box,
  InputControl,
  Ins_Cont_Controls,
  PlaceHolder_Cont_Controls,
  PremRF_Cont_Controls,
} from '../shared/formdesc';
import {
  ContainerId,
  DraggableListItem,
  DropListItem,
} from '../shared/template';
@Injectable({
  providedIn: 'root',
})
export class ControlBindService {
  constructor() {}
  //Utilities Buisness logic Methods
  checkboxChange = (
    cont_id: ContainerId,
    dropped_items: Array<DraggableListItem>,
    ctrl_key: Control_Key_Desc,
    dropped_index: number
  ) => {
    var desc: FormDesc[] = dropped_items[dropped_index].desc;
    var covtype: Group_Check_Box[] = (<CheckBoxControl>dropped_items
      .find((item) => item.id === 'ins')
      ?.desc.find((ctrl_arr) =>
        ctrl_arr.some((ctrl) => ctrl.key === Ins_Cont_Controls.CovType)
      )
      ?.find(
        (ctrl) =>
          ctrl.key === Ins_Cont_Controls.CovType && ctrl.type === 'check'
      )).grp_list.filter((check_box) => check_box.checked);
    switch (cont_id) {
      case 'ins':
        var age_enabled: boolean | undefined = (<CheckBoxControl>(
          desc
            .find((ctrl_arr) =>
              ctrl_arr.some((ctrl) => ctrl.key === Ins_Cont_Controls.AgeReq)
            )
            ?.find(
              (ctrl) =>
                ctrl.key === Ins_Cont_Controls.AgeReq && ctrl.type === 'check'
            )
        )).grp_list.find(
          (check_box) => check_box.id === 'Age/BirthDate'
        )?.checked;
        var target_index = this.filterStaticControls(
          desc,
          PlaceHolder_Cont_Controls.NONE,
          Ins_Cont_Controls.AgeReq
        );
        if (age_enabled) {
          this.getLst_from_combCheck(
            covtype.map((check_box) => check_box.id),
            cont_id
          ).forEach((cov_type) => {
            desc[target_index].push(<InputControl>{
              type: 'input',
              key: <Control_Key_Desc>(<unknown>cov_type.split(' ').join('')),
              label: cov_type,
              grp_list: [
                {
                  id: 'min',
                  label: 'Minimum',
                  validators: ['required'],
                  value: '',
                  type: 'number',
                },
                {
                  id: 'max',
                  label: 'Maximum',
                  validators: ['required'],
                  value: '',
                  type: 'number',
                },
                {
                  id: 'ren',
                  label: 'Renewal',
                  validators: ['required'],
                  value: '',
                  type: 'number',
                },
              ],
              class: 'input-list-col',
              bindevent: true,
              dyn_desc: {
                dyn: true,
                rel: Ins_Cont_Controls.CovType,
              },
            });
          });
        }
        break;
      case 'premrf':
        var rat_facts: Group_Check_Box[] = (<CheckBoxControl>(
          desc
            .find((ctrl_arr) =>
              ctrl_arr.some(
                (ctrl) => ctrl.key === PremRF_Cont_Controls.PremFacts
              )
            )
            ?.find((ctrl) => ctrl.key === PremRF_Cont_Controls.PremFacts)
        )).grp_list.filter((checks) => checks.checked);
        if (rat_facts.map((checks) => checks.id).includes('Age')) {
          this.getLst_from_combCheck(
            covtype.map((check_box) => check_box.id),
            cont_id
          ).forEach((covs) => {});
        }
    }
    return desc;
  };
  getLst_from_combCheck = (
    check_list: string[],
    cont_id: ContainerId
  ): string[] => {
    var meta_info: string[] = [];
    switch (cont_id) {
      case 'ins':
        check_list.forEach((e) => {
          var splitted_items = e.split(' ');
          let comb_str: string[] = [];
          var only_index = splitted_items.indexOf('Only');
          var and_index = splitted_items.indexOf('and');
          if (only_index !== -1) {
            comb_str.push(
              [...splitted_items].splice(0, only_index).join('').toString()
            );
          }
          if (and_index !== -1) {
            comb_str.push(
              [...splitted_items].splice(0, and_index).join('').toString()
            );
            comb_str.push(
              [...splitted_items]
                .splice(and_index + 1)
                .join('')
                .toString()
            );
          }
          comb_str.forEach((str) => {
            if (str === 'Family') {
              if (meta_info.indexOf('Spouse') === -1) {
                meta_info.push('Spouse');
              }
              if (meta_info.indexOf('Dependent') === -1) {
                meta_info.push('Dependent');
              }
            }
            if (str === 'Dependents' && meta_info.indexOf('Dependent') === -1) {
              meta_info.push('Dependent');
            }
            if (
              !meta_info.includes(str) &&
              str !== 'Family' &&
              str !== 'Dependents'
            ) {
              meta_info.push(str);
            }
          });
        });
        break;
    }
    return meta_info;
  };
  canDrop = (items: DropListItem[], cont_id: ContainerId): boolean => {
    var can: boolean = false;
    switch (cont_id) {
      case 'premrf':
        var ins_cont_index: number = items.findIndex(
          (item) => item.target_id === 'ins'
        );
        if (items[ins_cont_index].dropItem.length > 0) {
          var droppedItem: DraggableListItem =
            items[ins_cont_index].dropItem[0];
          var meta_desc: GenericControl | undefined = droppedItem.desc
            .reduce(function (prev, curr) {
              return prev.concat(curr);
            })
            .find((ctrl) => ctrl.key === droppedItem.meta_ctrl);
          if (
            meta_desc &&
            meta_desc.type === 'check' &&
            meta_desc.grp_list.some((check) => check.checked)
          ) {
            can = true;
          }
        }
        break;
      case 'pdt':
        can = true;
        break;
      case 'ins':
        can=true;
        break;
    }
    return can;
  };
  filterStaticControls = (
    desc: FormDesc[],
    ctrl_key: Control_Key_Desc,
    rel_ctrl_key: Control_Key_Desc
  ): number => {
    if (ctrl_key === PlaceHolder_Cont_Controls.NONE) {
      var grp_index = desc.findIndex((ctrl_arr) =>
        ctrl_arr.every((ctrl) => ctrl.dyn_desc.dyn)
      );
      if (grp_index === -1) {
        grp_index = desc.findIndex((ctrl_arr) =>
          ctrl_arr.some((ctrl) => ctrl.key === rel_ctrl_key)
        );
        if (grp_index === desc.length - 1) {
          if (!desc[grp_index + 1]) {
            desc.push([]);
          }
          grp_index++;
        } else {
          grp_index++;
          desc.splice(grp_index, 0, []);
        }
      } else {
        desc[grp_index] = [];
      }
      return grp_index;
    } else {
      var grp_index = desc.findIndex((ctrl_arr) =>
        ctrl_arr.some((ctrl) => ctrl.key === ctrl_key)
      );
      desc[grp_index] = desc[grp_index].filter(
        (ctrl) =>
          !ctrl.dyn_desc.dyn &&
          ctrl.dyn_desc.rel === PlaceHolder_Cont_Controls.NONE
      );
      return grp_index;
    }
  };
  getMeta_Info_forCheck = (
    cont_id: ContainerId,
    check_list: string[]
  ): string[] => {
    var metaInfo: string[] = [];
    switch (cont_id) {
      case 'ins':
        metaInfo = this.getLst_from_combCheck(check_list, cont_id);
        break;
      case 'premrf':
        metaInfo = check_list;
        break;
    }
    return metaInfo;
  };
}
