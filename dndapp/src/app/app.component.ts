import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ShareddropService } from './services/shareddrop.service';
import {
  Board,
  Column,
  DraggableListItem,
  DropListItems,
} from './shared/template';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Visualizer';
  opened: boolean = true;
  constructor(private ss: ShareddropService) {
    this.targetList = ss.newEntityList.map((obj) => {
      return { target_id: obj.data.id, dropItem: [] };
    });
  }
  targetList: Array<DropListItems> = [];
  Drop(event: CdkDragDrop<DraggableListItem[]>): void {
    this.ss.drop(event);
  }
  getlistbyId = (id: string): DraggableListItem[] => {
    var target_idex: number = this.targetList.findIndex(
      (e) => e.target_id === id
    );
    if (!this.targetList[target_idex]?.dropItem) {
      this.targetList[target_idex] = {
        target_id: id,
        dropItem: [],
      };
    }
    return this.targetList[target_idex].dropItem;
  };
  public get droplists(): string[] {
    return this.ss.newEntityList.map((e) => e.data.id);
  }
}
