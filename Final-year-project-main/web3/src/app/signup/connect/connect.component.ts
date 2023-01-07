import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoralisService } from 'src/app/Shared/services/moralis.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {

  constructor(private _router: Router, private _route: ActivatedRoute, private _moralis: MoralisService) {
  }

  ngOnInit(): void {
    
  }
  connectWallet = () => {
    this._moralis.connect()
      .then(
        (result: boolean) => {
          if (result) {
            this._moralis.checkExists()
            .then(
              (res:boolean)=>{
                if(res){
                  this._router.navigate(["../nextstep"], { relativeTo: this._route });
                }
                else{
                  this._router.navigate(["/home"], { relativeTo: this._route });
                }
              }
            );
          }
          else {
            this._router.navigate(["/home"], { relativeTo: this._route });
          }
        }
      );
  };
}
