import { Component, Inject, inject, computed, signal} from '@angular/core';
import { Surveys } from '../../services/surveys';
import { RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common'
import { Survey } from '../../interfaces/survey-interface';


@Component({
  selector: 'app-home-view-component',
  imports: [RouterLink],
  templateUrl: './home-view-component.html',
  styleUrl: './home-view-component.scss',
  // providers: [Surveys]
})
export class HomeViewComponent {
  categoryArray: string[] = ['all surveys', 'health-Care', 'business', 'lifestyle', 'education', 'population', 'money', 'Environment', 'Work'];
  surveysData = inject(Surveys);
  document;
  today = new Date();
  in30Days = new Date();
  deadline!: number;
  isWithinNext30Days!: boolean;
  dropdownOpen = false
constructor(@Inject(DOCUMENT) document: Document) {
  this.document = document
  // this.filterThisCategory('')
  console.log(this.filteredSurveys)
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

// loadQuestions(id: number) {
//     this.surveysData.getRelatedQuestions(id);
//   }

answers: object[] = [];
  async getAnswers(answerId: number): Promise<object[]> {
    this.answers = await this.surveysData.getRelatedAnswers(answerId);
    console.log(this.answers)
    return this.answers
  }

  toggleFilterOption(){
    this.dropdownOpen = !this.dropdownOpen
  }

  filteredSurveys: Survey[] = [];
  isFiltered = false
  filterThisCategory(category: string){
    if(category === 'all surveys'){
      this.dropdownOpen = false;
      this.filteredSurveys = this.surveysData.surveys()
      this.isFiltered = false
      console.log(this.isFiltered)
    }else{
    this.dropdownOpen = false;
    this.isFiltered = true
   this.filteredSurveys =  this.surveysData.surveys().filter((survey) => survey.category === category)
  console.log(this.filteredSurveys)
  console.log(this.isFiltered)
    }
  };

  filterActiveSurveys(){
    let activeSurveys = this.surveysData.surveys().filter((survey) => {
      const deadline = new Date(survey.deadline);
      return deadline >= this.today;
    })
    this.filteredSurveys = activeSurveys
    this.isFiltered = true
    console.log(this.isFiltered)
  }

  filterPastSurveys(){
    let pastSurveys = this.surveysData.surveys().filter((survey) => {
      const deadline = new Date(survey.deadline);
      return deadline < this.today;
    })
    this.filteredSurveys = pastSurveys
    this.isFiltered = true
    console.log(this.isFiltered)
  }
  
  }

