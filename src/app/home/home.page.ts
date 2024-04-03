import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Country } from '../models/country';
import { NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { RepositoryService } from '../services/repository.service';

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
    public loadingCtrl: LoadingController,
    private navController: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCountries();
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
}
