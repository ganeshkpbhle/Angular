import { Component, Input, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import Moralis from 'moralis';
import { MoralisService } from 'src/app/Shared/services/moralis.service';
import { Web3Service } from 'src/app/Shared/services/web3.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  @Input() userObj?:Moralis.Object|null;
  constructor(private _moralis: MoralisService, private dialog: MatDialog,private _web3:Web3Service,private ngzone:NgZone,private _router: Router, private _route: ActivatedRoute) { 
    this._moralis.SessionObjectChange.subscribe(
      (obj: Moralis.User) => {
        this.userObj = obj;
      }
    );
  }

  ngOnInit(): void {
  }
  logOut = () => {
    this._moralis.removeWallet()
      .then(
        () => {
          let user=Moralis.User.current();
          this._moralis.SessionObjectChange.emit(user);
          this._router.navigate(["/signin"], { relativeTo: this._route });
        }
      );
  };
}
