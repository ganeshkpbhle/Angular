
//Controls

export type InputControl = {
  type: 'input',
  key: Control_Key_Desc,
  label: string,
  grp_list: Array<Group_Input>,
  required: boolean,
  class: string,
  bindevent: boolean,
  dyn_desc: {
    dyn:boolean,
    rel:Control_Key_Desc
  }
};
export type SelectControl = {
  type: 'select',
  key: Control_Key_Desc,
  label: string,
  options: string[],
  validators: string[],
  required: boolean,
  option: number,
  bindevent: boolean,
  dyn_desc: {
    dyn:boolean,
    rel:Control_Key_Desc
  }
};
export type CheckBoxControl = {
  type: 'check',
  key: Control_Key_Desc,
  label: string,
  grp_list: Array<Group_Check_Box>,
  validators: string[],
  required: boolean,
  mincheck: number,
  class: string,
  bindevent: boolean,
  dyn_desc: {
    dyn:boolean,
    rel:Control_Key_Desc
  }
};
export type RadioControl = {
  type: 'radio',
  key: Control_Key_Desc,
  label: string,
  grp_items:Group_Radio,
  validators: string[],
  class: string,
  bindevent: boolean,
  dyn_desc: {
    dyn:boolean,
    rel:Control_Key_Desc
  }
};
export type SliderControl ={
  type: 'slider',
  key: Control_Key_Desc,
  label: string,
  min:number,
  max:number,
  range:[number,number]
  bindevent: boolean,
  class:string,
  dyn_desc: {
    dyn:boolean,
    rel:Control_Key_Desc
  }
};
export type GenericControl = InputControl | SelectControl | CheckBoxControl | RadioControl | SliderControl;
export type FormDesc = GenericControl[];
export type Group_Input = {
  id: string;
  value: string;
  validators: string[];
  label: string;
  type: string;
};

export type Group_Check_Box = {
  id: string;
  checked: boolean;
};
export type Group_Radio = {
  options:string[],
  value:number
};



export type Control_Key_Desc=GenInfo_Cont_Controls|Ins_Cont_Controls|PremRF_Cont_Controls|PlaceHolder_Cont_Controls;


export enum GenInfo_Cont_Controls{
  PdtInfo
}

export enum Ins_Cont_Controls{
  CovType,
  GrpIndv,
  AgeReq,
  MainInsured,
  Spouse,
  Dependent
}

export enum PremRF_Cont_Controls{
  PremFacts
}

export enum PlaceHolder_Cont_Controls{
  NONE,
}

