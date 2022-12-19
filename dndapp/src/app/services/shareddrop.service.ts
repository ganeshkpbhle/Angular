import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { DraggableListItem } from '../shared/template';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { EntityDialogComponent } from '../Dialog/entity-dialog/entity-dialog.component';
import { Validators } from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class ShareddropService {
  public static readonly newEntityList: Array<DraggableListItem> = [
    {
      data: {
        id: 'pdt',
        name: 'Product-Class',
      },
      color: 'rgb(1, 239, 96)',
      fcolor: 'black',
      desc:[
        {
          type:'input',
          key:'pdtClass',
          label:"ProductClass",
          defaultValue:"",
          validators:[Validators.required],
          required:true
        }
      ]
    },
    {
      data: {
        id: 'ins',
        name: 'Insured',
      },
      color: 'rgb(1, 239, 206)',
      fcolor: 'black',
      desc:[]
    },
    {
      data: {
        id: 'premrf',
        name: 'Premium-Rating-Factor',
      },
      color: 'rgb(255, 214, 134)',
      fcolor: 'black',
      desc:[]
    },
    {
      data: {
        id: 'benrf',
        name: 'Benefit-Rating-Factor',
      },
      color: 'rgb(95,0,0)',
      fcolor: 'white',desc:[]
    },
    {
      data: {
        id: 'sob',
        name: 'Schedule-of-Benefits',
      },
      color: 'rgb(196,20,100)',
      fcolor: 'white',desc:[]
    },
    {
      data: {
        id: 'cov',
        name: 'Coverages',
      },
      color: 'rgb(255, 232, 105)',
      fcolor: 'black',desc:[]
    },
    {
      data: {
        id: 'rates',
        name: 'Rates',
      },
      color: 'indigo',
      fcolor: 'white',desc:[]
    },
    {
      data: {
        id: 'prem',
        name: 'Premiums',
      },
      color: 'red',
      fcolor: 'white',desc:[]
    },
    {
      data: {
        id: 'pdct',
        name: 'Product Document',
      },
      color: 'rgb(0, 255,168)',
      fcolor: 'black',desc:[]
    },
    {
      data: {
        id: 'lmt',
        name: 'Limits',
      },
      color: 'olive',
      fcolor: 'black',desc:[]
    },
    {
      data: {
        id: 'dedct',
        name: 'Deductibles',
      },
      color: '#ff6347',
      fcolor: 'white',desc:[]
    },
    {
      data: {
        id: 'excl',
        name: 'Exclusion',
      },
      color: 'brown',
      fcolor: 'white',desc:[]
    },
  ];
  public readonly snlevalIds: string[] = ['pdt'];
  constructor(private dialog:MatDialog) {
    const dialogRef = this.dialog.open(EntityDialogComponent, {
      data: {desc:ShareddropService.newEntityList[0].desc},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  drop(event: CdkDragDrop<DraggableListItem[]>): void {
    var tgt_sidenav: boolean = event.container.id === 'sidenav';
    if (event.container.id === event.previousContainer.id && !tgt_sidenav) {
      console.log(event);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }
    if (
      event.container.id ===
        event.previousContainer.data[event.previousIndex].data.id ||
      (tgt_sidenav && event.previousContainer.id !== 'sidenav')
    ) {
      if (
        !this.snlevalIds.some((e) => e === event.container.id) &&
        !tgt_sidenav
      ) {
        copyArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        //code to open dialog
      } else {
        if (
          tgt_sidenav &&
          event.container.data.findIndex(
            (e) => e.data.id == event.previousContainer.id
          ) != -1
        ) {
          return;
        }
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        if(!tgt_sidenav){
          //code to open dialog
        }
      }
    }

  }
}
