import { Component, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { Inject, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Surveys } from '../../services/surveys';
import { Answer, Survey } from '../../interfaces/survey-interface';
import { Question } from '../../interfaces/survey-interface';
import { CompletedSurvey } from '../../interfaces/survey-interface';
import { createClient } from '@supabase/supabase-js';


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
  letter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  supabase = createClient("https://cejvxxwyidgknkfbpvgp.supabase.co", "sb_publishable_PCQYT5KWUFY1hpKYJZM1XQ_2ej6CAmT")

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
    // this.setInterval
    // clearInterval(this.setInterval)
  }
  get questions() {
    return this.surveysData.questions()
  }

  questionId: number[] = [];

  async ngOnInit() {
    this.document.body.classList.add('show-body');
    // const survey = 
    const survey = this.route.snapshot.paramMap.get('id');
    if (!survey) {
      return;
    }
    const id = Number(survey);
    if (Number.isNaN(id)) {
      return;
    }
    this.id = id;
    await this.surveysData.setRelatedQuestions(this.id) // holt sich die related questions anhand der id
    this.questionId = this.questions.map((question) => {
      console.log(question.id);
      return question.id
    })
    console.log(this.questionId)
    await this.getAnswers()
  }
  


  async getAnswers() {
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
  
  

  preventMultipleAnswers(event?: Event, question?: Question) {
    if (!question?.allowMultipleAnswers) {
      const checkboxes = (event?.target as HTMLElement).closest('.questionWrapper')?.querySelectorAll('input[type="checkbox"]');
      if (checkboxes) {
        checkboxes.forEach((checkbox) => {
          if (checkbox !== event?.target) {
            (checkbox as HTMLInputElement).checked = false;
          }
        });
      }
    } else {
      return
    }
  }

  choosenAnswerArray: CompletedSurvey[] = []
  
  collectAnswerIds(event: Event, question: Question, answerId?: Number | undefined) {
    const questionblock = (event.target as HTMLElement).closest('.questionWrapper');
    if (!questionblock) {
      return;
    }
    if (questionblock?.querySelectorAll('input[type="checkbox"]:checked').length > 0) {
      if (!question.allowMultipleAnswers) {
        this.choosenAnswerArray = this.choosenAnswerArray.filter((item) => (item.question_id !== question.id));
        this.choosenAnswerArray.push({
          survey_id: this.id,
          question_id: question.id,
          answer_id: answerId
        })
        console.log(this.choosenAnswerArray)
      } else {
        this.choosenAnswerArray.push({
          survey_id: this.id,
          question_id: question.id,
          answer_id: answerId
        })
      }
    } else if (questionblock?.querySelectorAll('input[type="checkbox"]:not(:checked)').length > 0) {
      if(!question.allowMultipleAnswers) {
      this.choosenAnswerArray.splice(this.choosenAnswerArray.findIndex((item) => item.question_id === question.id), 1);
      console.log(this.choosenAnswerArray)
    }else{
      this.choosenAnswerArray.splice(this.choosenAnswerArray.findIndex((item) => item.answer_id === answerId), 1);
      console.log(this.choosenAnswerArray)
    }
    this.submitCompletedSurvey()
  }
}
  
  async submitCompletedSurvey() {
    const surveyId = this.route.snapshot.paramMap.get('id'); //survey id holen
    if (!surveyId) {
      return;
    }
    const questionIds = this.choosenAnswerArray; // question und answer ids aus dem array holen
    let completedSurvey = {} as CompletedSurvey;
    for (let i = 0; i < questionIds.length; i++) {
    completedSurvey = {
      
      survey_id: questionIds[i].survey_id,
      question_id: questionIds[i].question_id,
      answer_id: questionIds[i].answer_id,
    }
  }
    console.log(completedSurvey)
    // const { data, error } = await this.supabase
    //   .from('choosenDetail')
    //   .insert(completedSurvey);
//============================================eventuell direkt über choosenAnswerArray iterieren und auf supabase pushen====================================
  }
}
