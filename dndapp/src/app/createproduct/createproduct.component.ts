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
  newEntityList:Array<DraggableListItem>=[
    {
      data: {
        id: "pdt",
        name: "Product-Class"
      }, color: "rgb(1, 239, 96)", fcolor: "black"
    },
    {
      data: {
        id: "ins",
        name: "Insured"
      }, color: "rgb(1, 239, 206)", fcolor: "black"
    },
    {
      data: {
        id: "premrf",
        name: "Premium-Rating-Factor"
      }, color: "rgb(255, 214, 134)", fcolor: "black"
    },
    {
      data: {
        id: "benrf",
        name: "Benefit-Rating-Factor"
      }, color: "rgb(95,0,0)", fcolor: "white"
    },
    {
      data: {
        id: "sob",
        name: "Schedule-of-Benefits"
      }, color: "rgb(196,20,100)", fcolor: "white"
    },
    {
      data: {
        id: "cov",
        name: "Coverages"
      }, color: "rgb(255, 232, 105)", fcolor: "black"
    },
    {
      data: {
        id: "rates",
        name: "Rates"
      }, color: "indigo", fcolor: "white"
    },
    {
      data: {
        id: "prem",
        name: "Premiums"
      }, color: "red", fcolor: "white"
    },
    {
      data: {
        id: "pdct",
        name: "Product Document"
      }, color: "rgb(0, 255,168)", fcolor: "black"
    },
    {
      data: {
        id: "lmt",
        name: "Limits"
      }, color: "olive", fcolor: "black"
    },
    {
      data: {
        id: "dedct",
        name: "Deductibles"
      }, color: "#ff6347", fcolor: "white"
    },
    {
      data: {
        id: "excl",
        name: "Exclusion"
      }, color: "brown", fcolor: "white"
    }
  ];
  ngOnInit(): void {
  }

}
