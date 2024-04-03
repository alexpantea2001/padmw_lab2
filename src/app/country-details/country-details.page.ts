import { Component, OnInit } from '@angular/core';
import { Country } from '../models/country';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../services/rest.service';
import { LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.page.html',
  styleUrls: ['./country-details.page.scss'],
})
export class CountryDetailsPage implements OnInit {
  country?: Country;
  code?: string;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rest: RestService,
    public loadingCtrl: LoadingController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.code = params['code'];
      if (this.code) {
        this.fetchCountryDetails(this.code);
      }
    });
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.country = (this.router.getCurrentNavigation()?.extras.state!['country'] as any) as Country;
      }
    });
  }

  fetchCountryDetails(code: string) {
    this.http.get<any>(`https://restcountries.com/v3.1/alpha/${code}`).subscribe({
      next: (data) => {
        // Update the country object with the fetched details
        this.country = data;
      },
      error: (err) => {
        console.error('Error fetching country details:', err);
        this.errorMessage = 'Failed to fetch country details';
      }
    });
  }
}