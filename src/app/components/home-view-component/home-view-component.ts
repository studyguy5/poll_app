import { Component, Inject, inject} from '@angular/core';
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
  today = new Date();
  in30Days = new Date();
  deadline!: number;
  isWithinNext30Days!: boolean;
  
constructor(@Inject(DOCUMENT) document: Document) {
  this.document = document
  // this.deadline = new Date(this.surveysData.surveys()[0].deadline);
  // this.isWithinNext30Days = this.deadline >= this.today && this.deadline <= this.in30Days;
}
ngOnInit() {
  this.document.body.classList.add('home-body');
}

ngOnDestroy() {
  this.document.body.classList.remove('home-body');
}

filterSurveys(){
  this.in30Days.setDate(this.today.getDate() + 30);
  if(this.surveysData){
    return this.surveysData.surveys().filter((survey) => {
      const deadline = new Date(survey.deadline);
      return deadline >= this.today && deadline <= this.in30Days;
    });
  }
  return this.surveysData;
}
}
