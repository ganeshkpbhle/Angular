import { Component, OnInit } from '@angular/core';
import { Moralis } from 'moralis';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  readonly serverUrl: string = "https://175kcqyeek4u.usemoralis.com:2053/server";
  readonly appId: string = "ZfqzBQLLAojOjUiza13NwHcKKdyWAWWCNWFQp4XF";
  user:string="";
  ethAddress?: string;
  ngOnInit(): void {
    Moralis.isInitialized=false;
    Moralis.start({ appId: this.appId, serverUrl: this.serverUrl })
      .then(
        () => {
          this.cachedUser()
            .then(
              () => {
                console.log("Initialized");
                Moralis.isInitialized=true;
              }
            )
            .catch(
              (err) => {
                console.log(err?.message);
              }
            );
        }
      );
  };
  login = () => {
    if (!this.user) {
      Moralis.authenticate()
        .then(
          (response: any) => {
            this.user = JSON.stringify(response);
          }
        );
    }
  };
  logout = () => {
    Moralis.User.logOut()
    .then(
      ()=>{
        console.log("logged out ==>");
        this.user="";
      }
    );
  };
  cachedUser = async () => {
    this.user = JSON.stringify(await Moralis.User.current());
  };
  objTest=()=>{
   console.log("In");
  };
}
