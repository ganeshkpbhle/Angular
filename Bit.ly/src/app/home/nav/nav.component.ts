import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { ApiService } from '../../services/api.service';
import { _Logout, _UserInfo } from '../../shared/data_layout';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() user: _UserInfo | undefined;
  @Output() userChange = new EventEmitter<_UserInfo | undefined>();
  proflogo: string = "";
  sideBar:boolean=false;
  SideElements:any = [
    {
      title: "Home",
      path: 'dash',
      cName: 'nav-text',
      icon: "fa-solid fa-house fa-1.5x",
      active: "act",
      inactive: "inact"
    },
    {
      title: "History",
      path: 'history',
      cName: 'nav-text',
      icon: "fa-solid fa-clock-rotate-left fa-1.5x",
      active: "act",
      inactive: "inact"
    },
    {
      title: "Profile",
      path: 'profile',
      cName: 'nav-text',
      icon: "fa-solid fa-id-card fa-1.5x",
      active: "act",
      inactive: "inact"
    }
  ];
  constructor(private _apiservice:ApiService,private route:Router) {
  }
  ngOnInit(): void {
    this.proflogo=`${environment.DICE_BEAR+this.user?.email+this.user?.id}.svg`;
  }
  toggle=()=>{
    this.sideBar=!this.sideBar;
  };
  logout=()=>{
    const payload:_Logout={Del:this.user?.id};
    this._apiservice.logout(payload)
    .subscribe(
      (response:number)=>{
        if(response===1){
          localStorage.clear();
          this.route.navigate(["/login"]);
        }
      }
    );
  };
}
