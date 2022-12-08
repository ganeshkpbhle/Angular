
import { Action } from '@ngrx/store';
import { ShareddropService } from 'src/app/services/shareddrop.service';
import { DropListItem } from 'src/app/shared/template';
import { TargetListActions, TargetListActionType} from '../models/actions/targetlist.actions';

 const initialState:DropListItem[]=ShareddropService.newEntityList.map((obj) => {
        return { target_id: obj.data.id, dropItem: [] };
    }); 

export function TargetListReducer(
   state: Array<DropListItem> = initialState,
   action: Action
) {
    let actionI = action as TargetListActions;
   switch (actionI.type) {
     case TargetListActionType.ADD_ITEM:
       return [...state, actionI.payload];
     default:
       return state;
   }
}