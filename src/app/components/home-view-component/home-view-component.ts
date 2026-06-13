import { Component, inject } from '@angular/core';
import { Surveys } from '../../services/surveys';


@Component({
  selector: 'app-home-view-component',
  imports: [],
  templateUrl: './home-view-component.html',
  styleUrl: './home-view-component.scss',
})
export class HomeViewComponent {
  surveysData = inject(Surveys);
}
