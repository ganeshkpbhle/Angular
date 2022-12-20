import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntityDialogComponent } from '../Dialog/entity-dialog/entity-dialog.component';
import { ShareddropService } from '../services/shareddrop.service';
import { FormDesc, GenericControl } from '../shared/formdesc';
import { DraggableListItem, DropListItem } from '../shared/template';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css']
})
export class CreateproductComponent implements OnInit,OnDestroy {
  opened: boolean = true;
  hoverShow:boolean=false;
  constructor(private ss: ShareddropService,private dialog:MatDialog) {
    this.targetList$=ShareddropService.newEntityList.map((obj) => {
      return { target_id: obj.meta_data.id, dropItem: [] };
    });
  }
  targetList$: Array<DropListItem>;
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    
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
  getMetaInfo=(entity:DraggableListItem,ind:number):string=>{
    var control_desc:GenericControl = entity.desc[entity.meta_index];
    switch (control_desc.type) {
      case 'input':
        return (control_desc.value.length>0)?control_desc.value:`${entity.meta_data.name} ${ind}`;
      case 'select':
        var opt:string|undefined=control_desc.options[control_desc.option];
        return (opt && opt.length>0)?opt:`${entity.meta_data.name} ${ind}`;
    }
  }
  removeEnt=(id:number,cont_id:string)=>{
    var target_idex: number = this.targetList$.findIndex(
      (e) => e.target_id === cont_id
    );
    var drop_hold_list:DraggableListItem[]=this.targetList$[target_idex].dropItem;
    if(drop_hold_list.length == 1)
    {
      this.targetList$[target_idex].dropItem=[];
      return;
    }
    drop_hold_list=drop_hold_list.splice(id,1);
  }
  editEnt=(cont_id:string,curr_index:number)=>{
    var target_idex: number = this.targetList$.findIndex(
      (e) => e.target_id === cont_id
    );
    var edit_Item:FormDesc=this.targetList$[target_idex].dropItem[curr_index].desc;
    var desc:FormDesc=(this.ss.snlevalIds.some(e => e===cont_id))?edit_Item:JSON.parse(JSON.stringify(edit_Item));
    this.dialog.open(EntityDialogComponent, {
      data: {desc},
    }).componentInstance.onsaveData.subscribe((result:FormDesc)=>{
      this.targetList$[target_idex].dropItem[curr_index].desc=result;
    });
  }
  public get droplists(): string[] {
    return ShareddropService.newEntityList.map((e) => e.meta_data.id);
  }
}
