import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeViewComponent } from './components/home-view-component/home-view-component';
import { CreateSurveyComponent } from './components/create-survey-component/create-survey-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateSurveyComponent, HomeViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('poll_app');
}
