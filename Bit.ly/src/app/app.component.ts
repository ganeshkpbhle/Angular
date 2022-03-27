import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  text:string="";
  constructor(private http: HttpClient){
  }
  title = 'Bit.ly';
  fetch=()=>{
    this.http.get("https://615e89e13d1491001755a97b.mockapi.io/users")
    .subscribe(
      (response:any)=>{
        this.text=JSON.stringify(response);
        console.log(response);
      }
    );
  };
}
