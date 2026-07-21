import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { Inject, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Surveys } from '../../services/surveys';
import { Answer, statistics, Survey } from '../../interfaces/survey-interface';
import { Question } from '../../interfaces/survey-interface';
import { computedStatistics } from '../../interfaces/survey-interface';
import { CompletedSurvey } from '../../interfaces/survey-interface';
import { createClient } from '@supabase/supabase-js';
import { computed } from '@angular/core';
import { Router } from '@angular/router';

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
  letter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  supabase = createClient("https://cejvxxwyidgknkfbpvgp.supabase.co", "sb_publishable_PCQYT5KWUFY1hpKYJZM1XQ_2ej6CAmT")
  router: Router;

  get survey(): Survey | undefined {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === null) {
      return undefined;
    }
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      return undefined;
    }
    this.idForQuestions = id
    return this.surveysData.surveys().find((survey) => survey.id === id);
  }


  idForQuestions: number = 1
  
  constructor(@Inject(DOCUMENT) document: Document, router: Router) {
    this.document = document;
    this.router = router
    // clearInterval(this.setInterval)
  }
  get questions() {
    return this.surveysData.questions()
  }
  

  questionId: number[] = [];
  
  async ngOnInit() {
    this.document.body.classList.add('show-body');      
    const survey = this.route.snapshot.paramMap.get('id');
    if (!survey) {
      return;}
    const id = Number(survey);
    if (Number.isNaN(id)) {
      return;}
    this.id = id;
    await this.surveysData.getStatisticsData(id) // alle Einträge zu einer survey id
    await this.surveysData.setRelatedQuestions(this.id) // holt sich die related questions anhand der id
    this.questionId = this.questions.map((question) => {
      return question.id
    })
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
    } else {return}
  }

  choosenAnswerArray: CompletedSurvey[] = []
  submission_id = crypto.randomUUID()

  collectAnswerIds(event: Event, question: Question, answerId?: Number | undefined) {
    const questionblock = (event.target as HTMLElement).closest('.questionWrapper');
    if (!questionblock) {
      return;}
    if (questionblock?.querySelectorAll('input[type="checkbox"]:checked').length > 0) {
      this.handleclickedAnswers( question, answerId)
    } else if (questionblock?.querySelectorAll('input[type="checkbox"]:not(:checked)').length > 0) {
      this.handleunChoosenAnswers(question, answerId)
    }
  }
  
  handleclickedAnswers( question: Question, answerId?: Number | undefined) {
    if (!question.allowMultipleAnswers) {
      this.choosenAnswerArray = this.choosenAnswerArray.filter((item) => (item.question_id !== question.id));
      this.choosenAnswerArray.push({
        survey_id: this.id,
        question_id: question.id,
        answer_id: answerId,
        submission_id: this.submission_id})
    } else {
      this.choosenAnswerArray.push({
        survey_id: this.id,
        question_id: question.id,
        answer_id: answerId,
        submission_id: this.submission_id
      })
    }
  }

  handleunChoosenAnswers(question: Question, answerId?: Number | undefined) {
    if (!question.allowMultipleAnswers) {
      this.choosenAnswerArray.splice(this.choosenAnswerArray.findIndex((item) => item.question_id === question.id), 1);
      console.log(this.choosenAnswerArray)
    } else {
      this.choosenAnswerArray.splice(this.choosenAnswerArray.findIndex((item) => item.answer_id === answerId), 1);
      console.log(this.choosenAnswerArray)
    }
    
  }
  

  async submitCompletedSurvey() {
    const surveyId = this.route.snapshot.paramMap.get('id'); //survey id holen
    if (!surveyId) {
      return;
    }
    let completedSurvey = {} as CompletedSurvey;
    for (let i = 0; i < this.choosenAnswerArray.length; i++) {
      const { data, error } = await this.supabase
        .from('choosenDetail')
        .insert(this.choosenAnswerArray[i]);
      console.log(this.choosenAnswerArray)
    }
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 4000)
  }

  xTimesSurveyFilled: number = 0
  
  computedStatistics: Signal<computedStatistics> = computed(() => {
    const statisticsData = this.surveysData.statistics()
    const uniqueSubmissionIds = new Set(statisticsData.map((item) => item.submission_id)).size
    console.log('submission', uniqueSubmissionIds)
    
    return {
      xTimesSurveyFilled: uniqueSubmissionIds,
      idsOfAnswer: statisticsData.map((item) => item.answer_id)
      
    }
  }
  
)
 
}