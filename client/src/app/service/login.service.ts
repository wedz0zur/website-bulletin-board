import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl =  "http://localhost:777/auth"

  constructor(private http: HttpClient) { }

  onLogin(obj: any){
   return this.http.post(`${this.apiUrl}/login` , obj)
  }

  getProfile(){
    return this.http.get(`${this.apiUrl}/profile` )
  }

  logout() {
    localStorage.removeItem('token');
  }

  editProfile(user: any, token: string): Observable<any> {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json; charset=utf-8'
  };

  return this.http.put(
    `${this.apiUrl}/update`,
    {
      name: user.name,
      userlogin: user.userlogin,
      email: user.email
    },
    { headers }
  );
}





}
