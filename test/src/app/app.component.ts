import { Component } from '@angular/core';
import { Moralis } from 'moralis';
import { User } from 'src/shared/layouts/data_layout';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly serverUrl: string = "https://8g9oweb09xcm.usemoralis.com:2053/server";
  readonly appId: string = "vm4GZpDHc8Ugnx0iSJzjCwGyCzX2H1G1MufyUQmg";
  user?:string|null;
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
                this.user=(this.user==='null')?null:this.user+'';
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
            this.ethAddress = response.attributes['ethAddress'];
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
        this.user=null;
      }
    );
  };
  cachedUser = async () => {
    this.user = JSON.stringify(await Moralis.User.current());
    //const temp:User={};
  };
  objTest=()=>{
    const LegendaryMonster = Moralis.Object.extend({
      className: "Monster"
    });
    const monster:Moralis.Object = new LegendaryMonster();
    monster.set('strength',1000);
  };
}
