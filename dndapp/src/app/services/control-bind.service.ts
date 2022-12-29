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
    desc: FormDesc[],
    ctrl_key: Control_Key_Desc
  ) => {
    switch (cont_id) {
      case 'ins':
        if (
          ctrl_key === Ins_Cont_Controls.AgeReq ||
          ctrl_key === Ins_Cont_Controls.CovType
        ) {
          var age_grp_index: number = desc.findIndex((ctrl_arr) =>
            ctrl_arr.some((ctrl) => ctrl.key === Ins_Cont_Controls.AgeReq)
          );
          var cov_grp_index: number = desc.findIndex((ctrl_arr) =>
            ctrl_arr.some((ctrl) => ctrl.key === Ins_Cont_Controls.CovType)
          );
          var agereq: CheckBoxControl = <CheckBoxControl>(
            desc[age_grp_index].find(
              (ctrl) => ctrl.key === Ins_Cont_Controls.AgeReq
            )
          );
          var covtype: CheckBoxControl = <CheckBoxControl>(
            desc[cov_grp_index].find(
              (ctrl) => ctrl.key === Ins_Cont_Controls.CovType
            )
          );
          desc[age_grp_index] = desc[age_grp_index].filter(
            (ctrl) =>
              !ctrl.dyn_desc.dyn &&
              ctrl.dyn_desc.rel === PlaceHolder_Cont_Controls.NONE
          );
          var age_enabled: boolean | undefined = agereq.grp_list.find(
            (check_box) => check_box.id === 'Age/BirthDate'
          )?.checked;
          if (age_enabled) {
            this.getLst_from_combCheck(
              covtype.grp_list
                .filter((check_box) => check_box.checked)
                .map((check_box) => check_box.id),
              cont_id
            ).forEach((cov_type) => {
              desc[age_grp_index].push(<InputControl>{
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
        }
        break;
      case 'premrf':
        var cov_grp_index: number = desc.findIndex((ctrl_arr) =>
          ctrl_arr.some((ctrl) => ctrl.key === Ins_Cont_Controls.CovType)
        );
        var facts_grp_index: number = desc.findIndex((ctrl_arr) =>
          ctrl_arr.some((ctrl) => ctrl.key === PremRF_Cont_Controls.PremFacts)
        );
        var rat_facts: Group_Check_Box[] = (<CheckBoxControl>(
          desc[facts_grp_index].find(
            (ctrl) => ctrl.key === PremRF_Cont_Controls.PremFacts
          )
        )).grp_list.filter((checks) => checks.checked);
        //desc=desc.splice(facts_grp_index,1);
        var covtype: CheckBoxControl = JSON.parse(
          JSON.stringify(
            desc[cov_grp_index].find(
              (ctrl) => ctrl.key === Ins_Cont_Controls.CovType
            )
          )
        );
        console.log(desc, rat_facts, covtype);
        var age_fact: boolean | undefined = rat_facts.find(
          (facts) => facts.id === 'Age'
        )?.checked;
      // if(age_fact){
      //   this.getLst_from_combCheck(
      //     covtype.grp_list
      //       .filter((check_box) => check_box.checked)
      //       .map((check_box) => check_box.id),
      //     cont_id
      //   ).forEach(covs =>{

      //   });
      // }
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
      case 'ins' || 'pdt':
        can = true;
        break;
    }
    return can;
  };
  filterStaticControls=(desc:FormDesc[])=>{
    var indices:number[]=[];
    var index=0;
    desc.forEach(ctrl_grp=>{
      
    });
  };
}
