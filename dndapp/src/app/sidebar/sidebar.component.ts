import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { DraggableEntity, DraggableListItem } from '../shared/template';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() entitiList: Array<DraggableListItem> = [];
  constructor() { }

  ngOnInit(): void {
  }
  drop=(event:CdkDragDrop<DraggableListItem[]>)=>{
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);
  }
}
