import { Component, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { Inject, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Surveys } from '../../services/surveys';
import { Answer, Survey } from '../../interfaces/survey-interface';
import { Question } from '../../interfaces/survey-interface';
// import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-show-survey-component',
  imports: [RouterLink],
  templateUrl: './show-survey-component.html',
  styleUrl: './show-survey-component.scss',
  // providers: [Surveys]
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


    answerArray: Answer[]  = []
    
    async getAnswers(){
      let answerArray: Answer[] = [] 
      console.log(this.questionId)
    for (let id of this.questionId) {
      
      answerArray = await this.surveysData.getRelatedAnswers(id) as Answer[]
      this.surveysData.questions.update((questions) =>
        questions.map((question) =>
          question.id === id ? { ...question, answers: answerArray } : question
        )
      )
    } 
  }


  ngOnDestroy() {
    this.document.body.classList.remove('show-body');
  }
}
