import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Country } from '../models/country';
import { NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { RepositoryService } from '../services/repository.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  countries: Country[] = [];
  errorMessage: string = '';

  constructor(
    public rest: RepositoryService,
    public restService: RestService,
    public loadingCtrl: LoadingController,
    private navController: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCountries();
    this.loginUser();
    this.getUsers(1, 10);
    this.getUser(3);
  }

  async getCountries() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading ...'
    });
    await loading.present();
    await this.rest.getCountries()
    .subscribe({
       next: (countries) => {
          this.countries = countries.sort(
             (a, b) => a.name.official.localeCompare(b.name.official)
          );
          loading.dismiss();
       },
       error: (err) => {
          this.errorMessage = err;
          loading.dismiss();
       }
    });
  }

  showDetails(country: Country) {
    const navigationExtras: NavigationExtras = {
      state: {
        country
      }
    };
    this.router.navigate(['/country-details', country], navigationExtras);
  }
  loginUser(): void {
    this.restService.loginUser()
      .subscribe(
        (response: any) => {
          console.log('Login response:', response);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
  getUsers(page: number, per_page: number): void {
    this.restService.getUsers(page, per_page)
    .subscribe(
      (response: any) => {
        console.log('List of users response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  getUser(id: number): void {
    this.restService.getUser(id)
    .subscribe(
      (response: any) => {
        console.log('User response:', response);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
