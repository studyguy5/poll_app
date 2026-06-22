import { Component, OnDestroy, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-survey-component',
  imports: [RouterLink],
  templateUrl: './show-survey-component.html',
  styleUrl: './show-survey-component.scss',
})
export class ShowSurveyComponent {
document;
  constructor(@Inject(DOCUMENT) document: Document) {
    this.document = document
  }
  ngOnInit() {
  this.document.body.classList.add('show-body');
}

ngOnDestroy() {
  this.document.body.classList.remove('show-body');
}
}
