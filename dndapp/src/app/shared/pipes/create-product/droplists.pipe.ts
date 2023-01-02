import { Pipe, PipeTransform } from '@angular/core';
import { ControlBindService } from 'src/app/services/control-bind.service';
import { Control_Key_Desc, FormDesc, GenericControl } from '../../formdesc';
import { ContainerId, DraggableListItem, DropListItem } from '../../template';

@Pipe({
  name: 'droplists',
})
export class DroplistsPipe implements PipeTransform {
  transform(id: string, targetList$: DropListItem[]): DraggableListItem[] {
    var target_idex: number = targetList$.findIndex((e) => e.target_id === id);
    return targetList$[target_idex].dropItem;
  }
}
@Pipe({
  name: 'metainfo',
})
export class MetaInfoPipe implements PipeTransform {
  constructor(private bind_service: ControlBindService) {}
  transform(
    desc: FormDesc[],
    id: ContainerId,
    meta_key: Control_Key_Desc
  ): string[] {
    var MetaInfo: string[] = [];
    if (desc.length === 0) {
      return [];
    }
    var ent_desc: GenericControl = <GenericControl>desc
      .reduce(function (prev, curr) {
        return prev.concat(curr);
      })
      .find((ctrl) => ctrl.key === meta_key);
    switch (ent_desc.type) {
      case 'check':
        MetaInfo = this.bind_service.getMeta_Info_forCheck(
          id,
          ent_desc.grp_list
            .filter((checks) => checks.checked)
            .map((checks) => checks.id)
        );
        break;
    }
    return MetaInfo;
  }
}
