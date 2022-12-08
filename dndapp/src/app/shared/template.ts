export interface DraggableEntity {
  id: string;
  name: string;
}
export interface DraggableListItem {
  data: DraggableEntity;
  color: string;
  fcolor: string;
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
