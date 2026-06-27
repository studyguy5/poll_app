import { Component, OnDestroy, OnInit } from '@angular/core';
import { Inject, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Surveys } from '../../services/surveys';
import { Survey } from '../../interfaces/survey-interface';


@Component({
  selector: 'app-show-survey-component',
  imports: [RouterLink],
  templateUrl: './show-survey-component.html',
  styleUrl: './show-survey-component.scss',
})
export class ShowSurveyComponent {
  surveysData = inject(Surveys);
  route = inject(ActivatedRoute);
  document;
  id: number = 1;
  
  
  get survey(): Survey | undefined {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === null) {
      return undefined;
    }

    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return undefined;
    }
      this.surveysData.surveys().find((survey) => survey.id === id);
      this.idForQuestions = id
    
    return this.surveysData.surveys().find((survey) => survey.id === id);
  }

  idForQuestions: number = 1 

  constructor(@Inject(DOCUMENT) document: Document) {
    this.document = document;
  }
  get questions() {
    return this.surveysData.questions()
  }

  questionId: number[] = [];
  
  
  
  
  
  async ngOnInit() {
    this.document.body.classList.add('show-body');
    const survey = this.survey;
    if (!survey) {
      return;
    }
    this.id = survey.id;
    await this.surveysData.setRelatedQuestions(this.id) // holt sich die related questions anhand der id
    this.questionId = this.questions.map((question) => {console.log(question.id);
      return question.id})
      await this.getAnswers()
    }
    answers  = {}
    
    async getAnswers(){
    for (const id of this.questionId) {
      this.answers = await this.surveysData.getRelatedAnswers(id)
      
    }
      
    
  }

  ngOnDestroy() {
    this.document.body.classList.remove('show-body');
  }
}
