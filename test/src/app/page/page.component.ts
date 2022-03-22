import { Component, OnInit } from '@angular/core';
import { Moralis } from 'moralis';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  readonly serverUrl: string = "https://8g9oweb09xcm.usemoralis.com:2053/server";
  readonly appId: string = "vm4GZpDHc8Ugnx0iSJzjCwGyCzX2H1G1MufyUQmg";
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
                const _user=new Moralis.Query("_User");
                _user.equalTo("username",JSON.parse(this.user).username);
                _user.find().then(
                  (response1:any)=>{
                    const params={id:response1[0]?.id};
                    Moralis.Cloud.run("testFun",params).then(
                      (result1:any)=>{
                        console.log(result1[0]?.expiresAt);
                      }
                    );
                  }
                );
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
            console.log(response);
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
        this.user="";
      }
    );
  };
  cachedUser = async () => {
    this.user = JSON.stringify(await Moralis.User.current());
  };
  objTest=()=>{
    const LegendaryMonster = Moralis.Object.extend({
      className: "Monster"
    });
    const monster:Moralis.Object = new LegendaryMonster();
    monster.set('strength',1000);
    monster.save();
  };
}
