import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Country } from '../models/country';
import { RestService } from './rest.service';

const TIME_OFFSET = 1;

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private repoStorage: Storage | null = null;
  private countries = new BehaviorSubject<Country[]>([]);
  private countriesErr = new BehaviorSubject<string>('');
  public countriesDate?: Date;
  public countriesFromCache = false;

  constructor(private storage: Storage, private rest: RestService) {
    this.init();
  }

  private async init() {
    const storage = await this.storage.create();
    this.repoStorage = storage;
  }

  getCountries(): Observable<Country[]> {
    this.repoStorage?.get('countriesDate')
    .then(date => {
      let refresh = false;
      this.countriesDate = date;
      if (this.countriesDate) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - TIME_OFFSET);
        if (this.countriesDate?.getTime() < now.getTime()) {
          refresh = true;
        }
      }
      else {
        refresh = true;
      }
      if (refresh) {
        this.rest.getCountries()
        .subscribe({
          next: (countries) => {
            this.countriesFromCache = false;
            this.countries.next(countries);
            this.countriesErr.next('');
            this.repoStorage?.set('countriesDate', new Date());
            this.repoStorage?.set('countries', countries);
          },
          error: (err) => {
            this.countriesErr.next(err);
          }
        });
      } else {
        this.repoStorage?.get('countries')
        .then((countries) => {
          this.countries.next(countries);
          this.countriesFromCache = true;
        })
        .catch((err) => this.countriesErr.next(err));
      }
    })
    .catch((err) => this.countriesErr.next(err));
    return this.countries;
  }
}