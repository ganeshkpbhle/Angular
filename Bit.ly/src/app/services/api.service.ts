import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment.prod';
import * as layout from '../shared/data_layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoaderService } from './loader.service';
import { _UrlList } from '../shared/data_layout';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private header: HttpHeaders | undefined;
  private Info: layout._UserInfo | undefined;
  private HistoryData: Array<layout._UrlList> = [];
  HistoryUpdated:EventEmitter<Array<layout._UrlList>>=new EventEmitter<Array<layout._UrlList>>();
  UserInfoUpdated:EventEmitter<layout._UserInfo>=new EventEmitter<layout._UserInfo>();
  constructor(private http: HttpClient, private loader: LoaderService) { }
  setHeader = () => {
    if (localStorage["user"] !== null) {
      const data: layout._LoginResponse = JSON.parse(localStorage["user"]);
      this.header = new HttpHeaders(
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`
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
  logout = (data: layout._Logout) => {
    this.setHeader();
    return this.http.post<number>(`${environment.API_URL}user/logout`, data, { headers: this.header });
  };
  addUrl = (url: layout._PostUrl) => {
    this.setHeader();
    return this.http.post<boolean>(`${environment.API_URL}url`, url, { headers: this.header });
  };
  verifyEmail = (data: layout._SendMail) => {
    this.setHeader();
    return this.http.post<string>(`${environment.API_URL}verify/Email`, data, { headers: this.header });
  };
  vfcApi = (data: layout._Vfc) => {
    this.setHeader();
    return this.http.post<boolean>(`${environment.API_URL}verify/post`, data, { headers: this.header });
  };
  ComputeDate = (user: layout._UrlCompute) => {
    this.setHeader();
    return this.http.post<Array<layout._ComputeResult>>(`${environment.API_URL}url/date`, user, { headers: this.header });
  };

  //get
  getUrlById = (id: string) => {
    this.setHeader();
    return this.http.get<string>(`${environment.API_URL}url/getId/${id}`, { headers: this.header });
  };
  getUrls = (id: number) => {
    this.setHeader();
    return this.http.get<Array<layout._UrlList>>(`${environment.API_URL}url/getlist/${id}`, { headers: this.header });
  };
  getUserSimple = (id: number) => {
    this.setHeader();
    return this.http.get<layout._UserInfo>(`${environment.API_URL}user/${id}`, { headers: this.header });
  };
  getUserBymail = (mail: string) => {
    return this.http.get<layout._LoginResponse | boolean>(`${environment.API_URL}user/getEmail/${mail}`);
  };

  //put
  updateUser = (id: number, data: layout._UpdateProf) => {
    this.setHeader();
    return this.http.put<layout._UpdateConfirm>(`${environment.API_URL}user/${id}`, data, { headers: this.header });
  };

  //delete
  delUrl = (id: string) => {
    this.setHeader();
    return this.http.delete<boolean>(`${environment.API_URL}url/${id}`, { headers: this.header });
  };


  //customized methods for data accessing
  getUserInfo(): Observable<layout._UserInfo> {
    const observeInfo = new Observable<layout._UserInfo>(
      (observer) => {
        setTimeout(() => {
          if (this.Info) {
            observer.next(this.Info);
          }
        },400);
      }
    );
    return observeInfo;
  };
  getHistory(): Observable<Array<layout._UrlList>> {
    const observeInfo = new Observable<Array<layout._UrlList>>(
      (observer) => {
        setTimeout(() => {
          if (this.HistoryData.length !== 0) {
            observer.next(this.HistoryData);
          }
        }, 400);
      }
    );
    return observeInfo;
  };
  setUserInfo = (param: layout._UserInfo) => {
    this.Info = param;
    this.UserInfoUpdated.emit(param);
  };
  setHistory = (param: Array<layout._UrlList>) => {
    this.HistoryData = param;
    this.HistoryUpdated.emit(param);
  };
  updateHistory = (id: number) => {
    this.getUrls(id)
      .subscribe(
        (response: Array<_UrlList>) => {
          this.HistoryData=response;
          this.HistoryUpdated.emit(response);
        }
      );
  };
}
