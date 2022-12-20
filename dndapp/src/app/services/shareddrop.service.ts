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
import { FormDesc, GenericControl } from '../shared/formdesc';
@Injectable({
  providedIn: 'root',
})
export class ShareddropService {
  public static readonly newEntityList: Array<DraggableListItem> = [
    {
      meta_data: {
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
          value:"",
          validators:[Validators.required],
          required:true,
        }
      ],
      meta_index:0
    },
    {
      meta_data: {
        id: 'ins',
        name: 'Insured',
      },
      color: 'rgb(1, 239, 206)',
      fcolor: 'black',
      desc:[
        {
          type:'select',
          key:'insType',
          label:"InsuredType",
          options:['MainInsured','Spouse','Dependent'],
          validators:[],
          required:true,
          option:-1
        }
      ],
      meta_index:0
    },
    {
      meta_data: {
        id: 'premrf',
        name: 'Premium-Rating-Factor',
      },
      color: 'rgb(255, 214, 134)',
      fcolor: 'black',
      desc:[],
      meta_index:0
    },
    {
      meta_data: {
        id: 'benrf',
        name: 'Benefit-Rating-Factor',
      },
      color: 'rgb(95,0,0)',
      fcolor: 'white',desc:[],meta_index:0
    },
    {
      meta_data: {
        id: 'sob',
        name: 'Schedule-of-Benefits',
      },
      color: 'rgb(196,20,100)',
      fcolor: 'white',desc:[],meta_index:0
    },
    {
      meta_data: {
        id: 'cov',
        name: 'Coverages',
      },
      color: 'rgb(255, 232, 105)',
      fcolor: 'black',desc:[],meta_index:0
    },
    {
      meta_data: {
        id: 'rates',
        name: 'Rates',
      },
      color: 'indigo',
      fcolor: 'white',desc:[],meta_index:0
    },
    {
      meta_data: {
        id: 'prem',
        name: 'Premiums',
      },
      color: 'red',
      fcolor: 'white',desc:[],meta_index:0
    },
    {
      meta_data: {
        id: 'pdct',
        name: 'Product Document',
      },
      color: 'rgb(0, 255,168)',
      fcolor: 'black',desc:[],meta_index:0
    },
    {
      meta_data: {
        id: 'lmt',
        name: 'Limits',
      },
      color: 'olive',
      fcolor: 'black',desc:[],meta_index:0
    },
    {
      meta_data: {
        id: 'dedct',
        name: 'Deductibles',
      },
      color: '#ff6347',
      fcolor: 'white',desc:[],meta_index:0
    },
    {
      meta_data: {
        id: 'excl',
        name: 'Exclusion',
      },
      color: 'brown',
      fcolor: 'white',desc:[],meta_index:0
    },
  ];
  public readonly snlevalIds: string[] = ['pdt'];
  constructor(private dialog:MatDialog) {
  }
  drop(event: CdkDragDrop<DraggableListItem[]>): void {
    var tgt_sidenav: boolean = event.container.id === 'sidenav';
    if (event.container.id === event.previousContainer.id && !tgt_sidenav) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }
    if (
      event.container.id ===
        event.previousContainer.data[event.previousIndex].meta_data.id ||
      (tgt_sidenav && event.previousContainer.id !== 'sidenav')
    ) {
      if (
        !this.snlevalIds.some((e) => e === event.container.id) &&
        !tgt_sidenav
      ) {
        var prev_cont:DraggableListItem[]=JSON.parse(JSON.stringify(event.previousContainer.data));
        var desc_index:number=prev_cont.findIndex(ctr => ctr.meta_data.id===event.container.id); 
        event.container.data.forEach(e =>{
          e.desc.forEach(ctrl =>{
            var control = prev_cont[desc_index].desc.find(ctr => ctr.key===ctrl.key);
            console.log(control);
            if(ctrl.type==='select' && control?.type==='select'){
              var ind:number = control.options.indexOf(ctrl.options[ctrl.option]);
              control.options.splice(ind,1);
            }
          })
        });
        copyArrayItem(
          prev_cont,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        //code to open dialog
        const dialogRef = this.dialog.open(EntityDialogComponent, {
          data: {desc:prev_cont[desc_index].desc},
        });
        dialogRef.componentInstance.onsaveData.subscribe((result:FormDesc) => {
          event.container.data[event.currentIndex].desc=result;
        });
      } else {
        if (
          tgt_sidenav &&
          event.container.data.findIndex(
            (e) => e.meta_data.id == event.previousContainer.id
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
          const dialogRef = this.dialog.open(EntityDialogComponent, {
            data: {desc:[... event.container.data[event.currentIndex].desc]},
          });
          dialogRef.componentInstance.onsaveData.subscribe((result:FormDesc) => {
            event.container.data[event.currentIndex].desc=result;
          });
        }
        else{
          event.container.data[event.currentIndex].desc.forEach(e => {
            switch(e.type){
              case 'input':
                e.value="";break;
              case 'select':
                e.option=-1;break;
            }
          });
        }
      }
    }

  }
}
