import {
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ShareddropService } from './services/shareddrop.service';
import {
  Board,
  Column,
  DraggableListItem,
  DropListItem,
} from './shared/template';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Visualizer';
}
