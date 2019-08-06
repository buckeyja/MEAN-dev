import { Component, OnInit, Input } from '@angular/core';

import { Location } from '../location';
import { Loc8rDataService } from '../loc8r-data.service';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  @Input() location: Location;

  public googleAPIKey: string = '<AIzaSyAJsF4qbHF9mQenMsDpIlYbL5ThEKxwCR4>';

  public formVisible: boolean = false;

  public formError: string;
  
  public newReview = {
    author: '',
    rating: 5,
    reviewText: ''
  };

  constructor(private loc8rDataService: Loc8rDataService) { }

  private resetAndHideReviewForm(): void {
    this.formVisible = false;
    this.newReview.author = '';
    this.newReview.rating = 5;
    this.newReview.reviewText = '';
  }

  private formIsValid(): boolean {
    if ( this.newReview.author && this.newReview.rating && this.newReview.reviewText) {
      return true;
    } else {
      return false;
    }
  }

  public onReviewSubmit(): void {
    this.formError = '';
    if (this.formIsValid()) {
      console.log('Review to add', this.newReview);
      this.loc8rDataService.addReviewByLocationId(this.location._id, this.newReview)
        .then(review => {
          console.log('Review saved', this.newReview);
          let reviews = this.location.reviews;
          // You need to construct the review or else the base this.newReview blank values are used instead.
          this.location.reviews.unshift({author: this.newReview.author, rating: this.newReview.rating, reviewText: this.newReview.reviewText, createdOn: new Date()});
          this.resetAndHideReviewForm();
        });
    } else {
      this.formError = 'All fields required, please try again';
    }
  }

  ngOnInit() {
  }

}
