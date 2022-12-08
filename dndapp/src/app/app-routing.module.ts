import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateproductComponent } from './createproduct/createproduct.component';
import { EditproductComponent } from './editproduct/editproduct.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'create',
    pathMatch:'full'
  },
  {
    path:'create',
    component:CreateproductComponent
  },
  {
    path:'edit',
    component:EditproductComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
