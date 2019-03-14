import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDetails, TokenPayload, TokenResponse} from '../models/user-details'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  uri = 'http://localhost:4000';
  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string) {
    
    localStorage.setItem('calendario-token', token);
    this.token = token;
  }

  private getToken(): string {
    
    if (!this.token) {
      
      this.token = localStorage.getItem('calendario-token');
    }
    
    return this.token;
  }

  public logout(): void {
    
    this.token = '';
    window.localStorage.removeItem('calendario-token');
    this.router.navigateByUrl('/');
  }

  public getUserDetails(): UserDetails {
    
    const token = this.getToken();
    let payload;
    
    if (token) {
      
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    }
    else
      return null;
  }

  public isLoggedIn(): boolean {
    
    const user = this.getUserDetails();
    
    if (user)
      return user.exp > Date.now() / 1000;
    else
      return false;
  }

  private request(method: 'post'|'get', type: 'login'|'register', user?: TokenPayload): Observable<any> {
    
    let base;
  
    if (method === 'post') {
      
      base = this.http.post(`${this.uri}/${type}`, user);
    }
    else {
      
      base = this.http.get(`${this.uri}/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }
  
    const request = base.pipe(
      
      map((data: TokenResponse) => {
        
        if (data.token) {
          
          this.saveToken(data.token);
        }
        
        return data;
      })
    );
  
    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    
    return this.request('post', 'login', user);
  }
}
