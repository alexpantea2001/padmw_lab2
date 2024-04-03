import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private countryListApiUrl = 'https://restcountries.com/v3.1/all?fields=cca2,name,capital,flags,region';
  constructor(private http: HttpClient) { }
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countryListApiUrl)
    .pipe(
       catchError(this.handleError)
    );
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
