import { Action } from '@ngrx/store';
import { DropListItem } from 'src/app/shared/template';

export enum TargetListActionType {
  ADD_ITEM = '[DROPITEM] Add DROPITEM',
}

export class AddTargetListAction implements Action {

  readonly type = TargetListActionType.ADD_ITEM;
  constructor(public payload:DropListItem) {}

}

export type TargetListActions = AddTargetListAction;
