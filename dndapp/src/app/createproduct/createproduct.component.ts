import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ShareddropService } from '../services/shareddrop.service';
import { DraggableListItem, DropListItem } from '../shared/template';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css']
})
export class CreateproductComponent implements OnInit {
  opened: boolean = true;
  hoverShow:boolean=false;
  constructor(private ss: ShareddropService) {
    this.targetList$=ShareddropService.newEntityList.map((obj) => {
      return { target_id: obj.data.id, dropItem: [] };
    });
  }
  targetList$: Array<DropListItem>;
  ngOnInit(): void {
  }
  Drop(event: CdkDragDrop<DraggableListItem[]>): void {
    this.ss.drop(event);
  }
  getlistbyId = (id: string): DraggableListItem[] => {
    var target_idex: number = this.targetList$.findIndex(
      (e) => e.target_id === id
    );
    return this.targetList$[target_idex].dropItem;
  };

  removeEnt=(id:number,cont_id:string)=>{
    var target_idex: number = this.targetList$.findIndex(
      (e) => e.target_id === cont_id
    );
    var drop_hold_list:DraggableListItem[]=[... this.targetList$[target_idex].dropItem];
    if(drop_hold_list.length == 1)
    {
      this.targetList$[target_idex].dropItem=[];
      return;
    }
    this.targetList$[target_idex].dropItem=drop_hold_list.splice(id,1);
  }
  
  public get droplists(): string[] {
    return ShareddropService.newEntityList.map((e) => e.data.id);
  }
}
