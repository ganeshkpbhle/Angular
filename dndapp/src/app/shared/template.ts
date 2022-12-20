import { FormDesc } from "./formdesc";

export interface DraggableEntity {
  id: string;
  name: string;
}
export interface DraggableListItem {
  meta_data: DraggableEntity;
  color: string;
  fcolor: string;
  meta_index:number;
  desc:FormDesc;
}
export interface DropListItem{
  target_id:string;
  dropItem:DraggableListItem[];
}
export class Column {
  constructor(public name: string, public id: string, public tasks: string[]) {}
}
export class Board {
  constructor(public name: string, public columns: Column[]) {}
}
