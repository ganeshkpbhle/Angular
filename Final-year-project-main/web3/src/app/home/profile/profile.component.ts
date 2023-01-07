import { Component, OnInit } from '@angular/core';
import Moralis from 'moralis';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { environment } from 'src/environments/environment';
 
@Component({
 selector: 'app-profile',
 templateUrl: './profile.component.html',
 styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
 user?: Moralis.User | null;
 username : String = "";
 email: String = "";
 emailVerified : Boolean = false;
 activeSince?: Number;
 accounts?: [String];
 dpUrl:string= environment.dicebear;
 presentDate : Date = new Date();
 createdDate? : Date;
 
 constructor(private _moralis: MoralisService) { }
 
 ngOnInit(): void {
  this.user = this._moralis.getCachedUser ;
  if (this.user && this.user !== null) {
   this.username = this.user.get("username");
   this.email = this.user.get("email");
   this.emailVerified = this.user.get("emailVerified");
   this.accounts = this.user.get("accounts");
   this.createdDate = this.user.get("createdAt");
   var Difference_In_Time = this.presentDate.getTime() - this.createdDate!.getTime();
   var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
   this.activeSince = Math.ceil(Difference_In_Days);
 }
 }
}
