import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../home-list/home-list.component';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  @Input() location: Location;

  public googleAPIKey: string = '<AIzaSyAJsF4qbHF9mQenMsDpIlYbL5ThEKxwCR4>'

  constructor() { }

  ngOnInit() {
  }

}
