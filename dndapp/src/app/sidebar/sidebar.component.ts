import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { ShareddropService } from '../services/shareddrop.service';
import { DraggableListItem } from '../shared/template';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  entitiList: Array<DraggableListItem> = [];
  constructor(private ss:ShareddropService) { }

  ngOnInit(): void {
    this.entitiList=[...ShareddropService.newEntityList];
  }
  Drop=(event:CdkDragDrop<DraggableListItem[]>)=>{
    this.ss.drop(event);
  }
  public get droplists() : string[] {
    return this.entitiList.map(e => e.meta_data.id);
  }
}
