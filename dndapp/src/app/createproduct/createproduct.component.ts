import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ShareddropService } from '../services/shareddrop.service';
import { DraggableListItem, DropListItem } from '../shared/template';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css']
})
export class CreateproductComponent implements OnInit {
  opened: boolean = true;
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
  getEntbyId=(id:string):string|undefined=>{
    return ShareddropService.newEntityList.find(e => e.data.id === id)?.data.name;
  }
  public get droplists(): string[] {
    return ShareddropService.newEntityList.map((e) => e.data.id);
  }
}
