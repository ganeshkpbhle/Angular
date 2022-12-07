import { Component, OnInit } from '@angular/core';
import { DraggableListItem } from '../shared/template';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css']
})
export class CreateproductComponent implements OnInit {

  constructor() { }
  opened: boolean|undefined=true;
  ngOnInit(): void {
  }

}
