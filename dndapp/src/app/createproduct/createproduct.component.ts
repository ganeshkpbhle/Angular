import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntityDialogComponent } from '../Dialog/entity-dialog/entity-dialog.component';
import { ControlBindService } from '../services/control-bind.service';
import { ShareddropService } from '../services/shareddrop.service';
import { FormDesc, GenericControl } from '../shared/formdesc';
import { DraggableListItem, DropListItem } from '../shared/template';


@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css'],
})
export class CreateproductComponent implements OnInit, OnDestroy {
  opened: boolean = true;
  hoverShow: boolean = false;
  constructor(
    private ss: ShareddropService,
    private dialog: MatDialog,
    private bind_service: ControlBindService
  ) {
    this.targetList$ = ShareddropService.newEntityList.map((obj) => {
      return { target_id: obj.id, dropItem: [] };
    });
  }
  targetList$: Array<DropListItem>;
  ngOnInit(): void {}
  ngOnDestroy(): void {}
  Drop(event: CdkDragDrop<DraggableListItem[]>): void {
    this.ss.drop(event, this.targetList$);
  }
  removeEnt = (id: number, cont_id: string) => {
    var target_idex: number = this.targetList$.findIndex(
      (e) => e.target_id === cont_id
    );
    var drop_hold_list: DraggableListItem[] =
      this.targetList$[target_idex].dropItem;
    if (drop_hold_list.length == 1) {
      this.targetList$[target_idex].dropItem = [];
      return;
    }
    drop_hold_list = drop_hold_list.splice(id, 1);
  };
  editEnt = (cont_id: string, curr_index: number) => {
    var target_idex: number = this.targetList$.findIndex(
      (e) => e.target_id === cont_id
    );
    this.dialog
      .open(EntityDialogComponent, {
        data: {
          cont_id,
          form_desc: this.targetList$
            .map((items) => items.dropItem)
            .reduce(function (prev, curr) {
              return prev.concat(curr);
            }),
          cont_name: this.targetList$[target_idex].dropItem[curr_index].name,
        },
        panelClass: 'full-screen-modal',
      })
      .componentInstance.onsaveData.subscribe((result: FormDesc[]) => {
        this.targetList$[target_idex].dropItem[curr_index].desc = result;
      });
  };
  public get droplists(): string[] {
    return ShareddropService.newEntityList.map((e) => e.id);
  }
}
