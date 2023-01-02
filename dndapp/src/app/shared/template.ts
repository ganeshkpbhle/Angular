import { Control_Key_Desc, FormDesc } from "./formdesc";

export type ContainerId = 'pdt'|'ins'|'premrf'|'benrf'|'sob'|'cov'|'rates'|'prem'|'pdct'|'lmt'|'dedct'|'excl'
export type DraggableEntity ={
  
}
export type DraggableListItem ={
  id: ContainerId;
  name: string;
  color: string;
  fcolor: string;
  meta_ctrl:Control_Key_Desc;
  desc:Array<FormDesc>
}
export type DropListItem ={
  target_id:string;
  dropItem:DraggableListItem[];
}

export type DialogInput={
  cont_name:string;
  cont_id: ContainerId;
  form_desc:DraggableListItem[]
}
