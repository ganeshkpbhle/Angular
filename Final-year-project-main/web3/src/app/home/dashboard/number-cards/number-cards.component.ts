import { Component, Input, OnInit } from '@angular/core';
import { GeneralCount } from 'src/app/Shared/data-layout';

@Component({
  selector: 'app-number-cards',
  templateUrl: './number-cards.component.html',
  styleUrls: ['./number-cards.component.css']
})
export class NumberCardsComponent implements OnInit {
  @Input() NumcardData:Array<GeneralCount>=[];
  constructor() { }

  ngOnInit(): void {
  }

}
