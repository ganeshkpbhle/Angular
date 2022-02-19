import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment.prod';
import * as layout from '../shared/data_layout';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  setHeader = () => {
    if (localStorage["user"]) {
      const data = JSON.parse(localStorage["user"]);

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
    return this.http.post<number>(`${environment.API_URL}user/logout`,data);
  };
  addUrl = (url: layout._PostUrl) => {
    this.setHeader();
    return this.http.post<string>(`${environment.API_URL}url`, url);
  };
  verifyEmail = (data:layout._SendMail) => {
    this.setHeader();
    return this.http.post<string>(`${environment.API_URL}verify/Email`, data);
  };
  vfcApi = (data:layout._Vfc) => {
    this.setHeader();
    return this.http.post<boolean>(`${environment.API_URL}verify/post`,data);
  };
  ComputeDate = (user: layout._UrlCompute) => {
    this.setHeader();
    return this.http.post<layout._ComputeResult>(`${environment.API_URL}url/date`, user);
  };

  //get

  getUrlById = (id: string) => {
    this.setHeader();
    return this.http.get<string>(`${environment.API_URL}url/getId/${id}`);
  };
  getUrls = (id: number) => {
    this.setHeader();
    return this.http.get<Array<layout._UrlList>>(`${environment.API_URL}url/getlist/${id}`);
  };
  getUserSimple = (id: number) => {
    this.setHeader();
    return this.http.get(`${environment.API_URL}user/getRes/${id}`);
  };
  getUserBymail = (mail: any) => {
    return this.http.get(`${environment.API_URL}user/getEmail/${mail}`);
  };

  //put
  updateUser = (id: number, data: any) => {
    this.setHeader();
    return this.http.put(`${environment.API_URL}user/${id}`, data);
  };

  //delete
  delUrl = (id:number) => {
    this.setHeader();
    return this.http.delete(`${environment.API_URL}url/${id}`);
};
}
