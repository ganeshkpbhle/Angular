import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment.prod';
import * as layout from '../shared/data_layout';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private header:HttpHeaders|undefined;
  constructor(private http: HttpClient) { }
  setHeader = () => {
    if (localStorage["user"]!==null) {
      const data:layout._LoginResponse = JSON.parse(localStorage["user"]);
      this.header=new HttpHeaders(
        {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${data.token}`
        }
      );
    }
    else { alert("You are an unAuthorized User"); }
  };

  //post
  addUser = (data: layout._SignIn) => {
    return this.http.post<number>(`${environment.API_URL}user`, data);
  };

  logIn = (data: layout._Login) => {
    return this.http.post<layout._LoginResponse>(`${environment.API_URL}user/login`, data);
  };
  logout = (data:layout._Logout) => {
    this.setHeader();
    return this.http.post<number>(`${environment.API_URL}user/logout`,data,{ headers:this.header });
  };
  addUrl = (url: layout._PostUrl) => {
    this.setHeader();
    return this.http.post<string>(`${environment.API_URL}url`, url,{ headers:this.header });
  };
  verifyEmail = (data:layout._SendMail) => {
    this.setHeader();
    return this.http.post<string>(`${environment.API_URL}verify/Email`, data,{ headers:this.header });
  };
  vfcApi = (data:layout._Vfc) => {
    this.setHeader();
    return this.http.post<boolean>(`${environment.API_URL}verify/post`,data,{ headers:this.header });
  };
  ComputeDate = (user: layout._UrlCompute) => {
    this.setHeader();
    return this.http.post<layout._ComputeResult>(`${environment.API_URL}url/date`, user,{ headers:this.header });
  };

  //get

  getUrlById = (id: string) => {
    this.setHeader();
    return this.http.get<string>(`${environment.API_URL}url/getId/${id}`,{ headers:this.header });
  };
  getUrls = (id: number) => {
    this.setHeader();
    return this.http.get<Array<layout._UrlList>>(`${environment.API_URL}url/getlist/${id}`,{ headers:this.header });
  };
  getUserSimple = (id: number) => {
    this.setHeader();
    return this.http.get<layout._UserInfo>(`${environment.API_URL}user/${id}`,{ headers:this.header });
  };
  getUserBymail = (mail:string) => {
    return this.http.get<layout._LoginResponse|boolean>(`${environment.API_URL}user/getEmail/${mail}`);
  };

  //put
  updateUser = (id: number, data: layout._UpdateProf) => {
    this.setHeader();
    return this.http.put<boolean>(`${environment.API_URL}user/${id}`, data,{ headers:this.header });
  };

  //delete
  delUrl = (id:number) => {
    this.setHeader();
    return this.http.delete(`${environment.API_URL}url/${id}`,{ headers:this.header });
};
}
