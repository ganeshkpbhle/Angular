//Controls

export type InputControl = {
  type: 'input';
  key: Control_Key_Desc;
  label: string;
  grp_list: Array<Group_Input>;
  required: boolean;
  class: string;
  bindevent: boolean;
  dyn_desc: {
    dyn: boolean;
    rel: Control_Key_Desc;
  };
};
export type SelectControl = {
  type: 'select';
  key: Control_Key_Desc;
  label: string;
  options: string[];
  validators: string[];
  required: boolean;
  option: number;
  bindevent: boolean;
  dyn_desc: {
    dyn: boolean;
    rel: Control_Key_Desc;
  };
};
export type CheckBoxControl = {
  type: 'check';
  key: Control_Key_Desc;
  label: string;
  grp_list: Array<Group_Check_Box>;
  validators: string[];
  required: boolean;
  mincheck: number;
  class: string;
  bindevent: boolean;
  dyn_desc: {
    dyn: boolean;
    rel: Control_Key_Desc;
  };
};
export type RadioControl = {
  type: 'radio';
  key: Control_Key_Desc;
  label: string;
  grp_items: Group_Radio;
  validators: string[];
  class: string;
  bindevent: boolean;
  dyn_desc: {
    dyn: boolean;
    rel: Control_Key_Desc;
  };
};
export type RangeSliderControl = {
  type: 'range-slider';
  key: Control_Key_Desc;
  label: string;
  min: number;
  max: number;
  range: [number, number];
  bindevent: boolean;
  validators: string[];
  class: string;
  dyn_desc: {
    dyn: boolean;
    rel: Control_Key_Desc;
  };
};
export type SliderControl = {
  type: 'slider';
  key: Control_Key_Desc;
  label: string;
  min: number;
  max: number;
  value: number;
  bindevent: boolean;
  class: string;
  validators: string[];
  dyn_desc: {
    dyn: boolean;
    rel: Control_Key_Desc;
  };
};
export type TabbedControls = {
  type: 'mat-tab';
  key: Control_Key_Desc;
  label: string;
  controls: Array<TabbedControlDesc>;
  class: string;
  dyn_desc: {
    dyn: boolean;
    rel: Control_Key_Desc;
  };
  tab_labels: string[];
};
export type GenericControl =
  | InputControl
  | SelectControl
  | CheckBoxControl
  | RadioControl
  | RangeSliderControl
  | SliderControl
  | TabbedControls;
export type FormDesc = GenericControl[];
export type NestedTabControl =
  | InputControl
  | SelectControl
  | CheckBoxControl
  | RadioControl
  | RangeSliderControl
  | SliderControl;
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
  options: string[];
  value: number;
};
export type TabbedControlDesc = {
  group: {
    label: string;
    grp: number;
  };
  control: NestedTabControl;
};

export type SelectOptions = string[];
export type Check_Options = {
  class: string;
  list: Array<Group_Check_Box>;
};
export type Input_Options = {
  class: string;
  list: Array<Group_Input>;
};
export type RadioOptions = {
  class: string;
  radio_grp: Group_Radio;
};

export type TabControlDesc={
    tab_desc: TabbedControls;
    tab_ctrls: Array<NestedTabControl[][]>;
}

export type Control_Key_Desc =
  | GenInfo_Cont_Controls
  | Ins_Cont_Controls
  | PremRF_Cont_Controls
  | PlaceHolder_Cont_Controls;

export enum GenInfo_Cont_Controls {
  PdtInfo = 'Product-Info',
}

export enum Ins_Cont_Controls {
  CovType = 'CoverageTypes',
  GrpIndv = 'GroupOrIndvidual',
  AgeReq = 'Age/BirthDate Required',
  MainInsured = 'Main Insured',
  Spouse = 'Spouse',
  Dependent = 'Dependent',
  OverAge = 'OverAge',
}

export enum PremRF_Cont_Controls {
  PremFacts = 'Premium-RatFact',
  AgeSlide = 'AgeSlider',
  PremFactsTab = 'Premium-RatFacts-Tab',
}

export enum PlaceHolder_Cont_Controls {
  NONE = '',
}
