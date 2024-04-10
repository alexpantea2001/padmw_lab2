import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Country } from '../models/country';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RestService {
   private countryListApiUrl = 'https://restcountries.com/v3.1/all?fields=cca2,name,capital,flags,region';
   private baseUrl = 'https://reqres.in/api';
   constructor(private http: HttpClient) { }
   getCountries(): Observable<Country[]> {
      return this.http.get<Country[]>(this.countryListApiUrl)
      .pipe(
         catchError(this.handleError)
      );
   }
   loginUser(): Observable<User[]> {
      var body = {
         email: 'emma.wong@reqres.in',
         password: '1234'
      }
      return this.http.post<User[]>(`${this.baseUrl}/login`, body)
      .pipe(
         catchError(this.handleError)
      );
   }
   getUsers(page: number, per_page: number): Observable<User[]> {
      return this.http.get<User[]>(`${this.baseUrl}/users?page=${page}&per_page=${per_page}`);
   }
   getUser(id: number): Observable<User[]> {
      return this.http.get<User[]>(`${this.baseUrl}/users/${id}`);
   }
 
 private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
    const err = error || '';
    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
    errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return throwError(() => new Error(errMsg));
 }
}
