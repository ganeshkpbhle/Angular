import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ContainerId, DraggableListItem, DropListItem } from '../shared/template';
import { MatDialog } from '@angular/material/dialog';
import { EntityDialogComponent } from '../Dialog/entity-dialog/entity-dialog.component';
import { FormDesc, GenInfo_Cont_Controls, Ins_Cont_Controls, PlaceHolder_Cont_Controls, PremRF_Cont_Controls } from '../shared/formdesc';
import { ControlBindService } from './control-bind.service';
@Injectable({
  providedIn: 'root',
})
export class ShareddropService {
  public static readonly newEntityList: Array<DraggableListItem> = [
    {
      id: 'pdt',
      name: 'General-Info',
      color: 'rgb(1, 239, 96)',
      fcolor: 'black',
      desc: [
        [
          {
            type: 'input',
            key: GenInfo_Cont_Controls.PdtInfo,
            label: 'ProductInfo',
            required: true,
            bindevent: false,
            grp_list: [
              {
                id: 'pdtClass',
                label: 'Product-Class',
                value: '',
                validators: ['required'],
                type: 'text',
              },
            ],
            class: 'input-list-col',
            dyn_desc: {dyn:false,rel:PlaceHolder_Cont_Controls.NONE},
          },
        ],
      ],
      meta_ctrl: GenInfo_Cont_Controls.PdtInfo,
    },
    {
      id: 'ins',
      name: 'Insureds',
      color: 'rgb(1, 239, 206)',
      fcolor: 'black',
      desc: [
        [
          {
            type: 'check',
            key: Ins_Cont_Controls.CovType,
            label: 'Insured',
            grp_list: [
              {
                id: 'Main Insured and Spouse',
                checked: false,
              },
              {
                id: 'Main Insured Only',
                checked: false,
              },
              {
                id: 'Main Insured and Family',
                checked: false,
              },
              {
                id: 'Main Insured and Dependents',
                checked: false,
              },
              {
                id: 'Spouse Only',
                checked: false,
              },
              {
                id: 'Spouse and Dependent',
                checked: false,
              },
              {
                id: 'Dependent Only',
                checked: false,
              },
            ],
            validators: ['required'],
            required: true,
            mincheck: 1,
            class: 'check-list-col',
            bindevent: true,
            dyn_desc: {dyn:false,rel:PlaceHolder_Cont_Controls.NONE}
          },
          {
            type: 'radio',
            key:Ins_Cont_Controls.GrpIndv,
            label: 'Indvidual or GroupRated',
            grp_items: {
              options: ['Indvidual', 'Non-Indvidual'],
              value: 1,
            },
            validators: [],
            class: 'radio-list-col',
            bindevent: false,
            dyn_desc: {dyn:false,rel:PlaceHolder_Cont_Controls.NONE}
          }
        ],
        [
          {
            type: 'check',
            key: Ins_Cont_Controls.AgeReq,
            label: 'Age/BirthDate-Required',
            grp_list: [
              {
                id: 'Age/BirthDate',
                checked: true,
              },
            ],
            validators: [],
            required: false,
            mincheck: 0,
            class: 'check-list-col',
            bindevent: true,
            dyn_desc: {dyn:false,rel:PlaceHolder_Cont_Controls.NONE}
          }
        ]
      ],
      meta_ctrl: Ins_Cont_Controls.CovType,
    },
    {
      id: 'premrf',
      name: 'Premium-Rating-Factor',
      color: 'rgb(255, 214, 134)',
      fcolor: 'black',
      desc: [
        [
          {
            type: 'check',
            key: PremRF_Cont_Controls.PremFacts,
            label: 'Premium-Rating-Factors',
            grp_list: [
              {
                id: 'Age',
                checked: false,
              },
              {
                id: 'Sex',
                checked: false,
              },
              {
                id: 'Dependents',
                checked: false,
              },
              {
                id: 'Insureds',
                checked: false,
              },
              {
                id: 'Smoking',
                checked: false,
              },
              {
                id: 'Deductible',
                checked: false,
              },
              {
                id: 'Global Payment Frequency',
                checked: false,
              },
            ],
            validators: ['required'],
            required: true,
            mincheck: 1,
            class: 'check-list-col',
            bindevent: true,
            dyn_desc: {dyn:false,rel:PlaceHolder_Cont_Controls.NONE}
          }
        ],
      ],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
    {
      id: 'benrf',
      name: 'Benefit-Rating-Factor',
      color: 'rgb(95,0,0)',
      fcolor: 'white',
      desc: [],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
    {
      id: 'sob',
      name: 'Schedule-of-Benefits',
      color: 'rgb(196,20,100)',
      fcolor: 'white',
      desc: [],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
    {
      id: 'cov',
      name: 'Coverages',
      color: 'rgb(255, 232, 105)',
      fcolor: 'black',
      desc: [],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
    {
      id: 'rates',
      name: 'Rates',
      color: 'indigo',
      fcolor: 'white',
      desc: [],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
    {
      id: 'prem',
      name: 'Premiums',
      color: 'red',
      fcolor: 'white',
      desc: [],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
    {
      id: 'pdct',
      name: 'Product Document',
      color: 'rgb(0, 255,168)',
      fcolor: 'black',
      desc: [],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
    {
      id: 'lmt',
      name: 'Limits',
      color: 'olive',
      fcolor: 'black',
      desc: [],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
    {
      id: 'dedct',
      name: 'Deductibles',
      color: '#ff6347',
      fcolor: 'white',
      desc: [],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
    {
      id: 'excl',
      name: 'Exclusion',
      color: 'brown',
      fcolor: 'white',
      desc: [],
      meta_ctrl: PlaceHolder_Cont_Controls.NONE,
    },
  ];
  constructor(
    private dialog: MatDialog,
    private control_bind: ControlBindService
  ) {}
  drop(event: CdkDragDrop<DraggableListItem[]>,combined_list:Array<DropListItem>): void {
    var tgt_sidenav: boolean = event.container.id === 'sidenav';
    if (event.container.id === event.previousContainer.id) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }
    if (
      event.container.id ===
        event.previousContainer.data[event.previousIndex].id ||
      (tgt_sidenav && event.previousContainer.id !== 'sidenav')
    ) {
      if (!tgt_sidenav && combined_list.length>0 && this.control_bind.canDrop(combined_list,<ContainerId>event.container.id)) {
        //code to open dialog
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        const dialogRef = this.dialog.open(EntityDialogComponent, {
          data: {
            cont_id: event.container.id,
            form_desc: event.container.data[event.currentIndex].desc,
            cont_name:event.container.data[event.currentIndex].name
          },
          panelClass: 'full-screen-modal',
        });
        dialogRef.componentInstance.onsaveData.subscribe(
          (result: FormDesc[]) => {
            event.container.data[event.currentIndex].desc = result;
          }
        );
      } else if(tgt_sidenav) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        event.container.data[event.currentIndex].desc
          .reduce(function (prev, curr) {
            return prev.concat(curr);
          })
          .forEach((e) => {
            switch (e.type) {
              case 'input':
                e.grp_list.forEach((inp) => {
                  inp.value = '';
                });
                break;
              case 'select':
                e.option = -1;
                break;
            }
          });
      }
    }
  }
}
