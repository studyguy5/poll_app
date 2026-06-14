import { Component, Inject, inject, OnInit, OnDestroy } from '@angular/core';
import { Surveys } from '../../services/surveys';
import { RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common'


@Component({
  selector: 'app-home-view-component',
  imports: [RouterLink],
  templateUrl: './home-view-component.html',
  styleUrl: './home-view-component.scss',
})
export class HomeViewComponent {
  surveysData = inject(Surveys);
  document;
  constructor(@Inject(DOCUMENT) document: Document) {
    this.document = document
  }
  ngOnInit() {
    this.document.body.classList.add('home-body');
  }
  
  ngOnDestroy() {
    this.document.body.classList.remove('home-body');
  }
}
