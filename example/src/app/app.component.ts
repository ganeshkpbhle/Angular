import { Attribute, Component } from '@angular/core';
import { Moralis } from 'moralis';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly serverUrl: string = "https://glvvxfyjeqa5.usemoralis.com:2053/server";
  readonly appId: string = "RMzcm2dlBiMLhqFQsCJeVRbhmrMlC8c67DJjqCAJ";
  moralis_init: boolean = true;
  title = 'example';
  user?: any;
  isLoggedIn = false;
  createdAt?: Date;
  updatedAt?: Date;
  ethAddress?: string;
  isAuthenticated = false;
  ngOnInit(): void {
    Moralis.initialize(this.appId);
    Moralis.serverURL = this.serverUrl;
    this.init(this.appId, this.serverUrl).then(
      () => {
        this.moralis_init = false;
        console.log("Initialized");
      }
    );
    if(localStorage["user"]!==null){
      console.log((JSON.parse(localStorage["user"]))?.createdAt);
    }
  }
  async login() {
    this.user = await Moralis.User.current();
    console.log(this.user);
    if (!this.user) {
      Moralis.authenticate()
        .then(
          (user:any) => {
            this.createdAt = user.createdAt;
            this.updatedAt = user.updatedAt;
            this.ethAddress = user.attributes['ethAddress'];
            localStorage.setItem("user",JSON.stringify(user));
            this.moralis_init=true;
          }
        );

    }
    this.isLoggedIn = true;
  }

  // Logout
  logOut() {
    Moralis.User.logOut()
    .then(
      (response:any)=>{
        console.log(response);
        this.moralis_init=false;
        console.log("logged out ==>");
        this.isLoggedIn = false;
      }
    );
  }
  async init(id: string, server: string) {
    console.log("initializing");
    await Moralis.start({ appId: id, serverUrl: server });
  }
}
