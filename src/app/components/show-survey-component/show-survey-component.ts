import { DOCUMENT, JsonPipe } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Question, Survey } from '../../interfaces/survey-interface';
import { Surveys } from '../../services/surveys';


@Component({
  selector: 'app-show-survey-component',
  imports: [RouterLink, JsonPipe],
  templateUrl: './show-survey-component.html',
  styleUrl: './show-survey-component.scss',
})
export class ShowSurveyComponent {
  surveysData = inject(Surveys);
  route = inject(ActivatedRoute);
  document;

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

    return this.surveysData.surveys().find((survey) => survey.id === id);
  }

  constructor(@Inject(DOCUMENT) document: Document) {
    this.document = document;
  }

  get questions(): Question[] {
    return this.surveysData.relatedQuestions();
  }

  answers: Object[] = [];
  async setAnswers() {
    const relatedQuestionIds = this.surveysData.relatedQuestions().map((q: Question) => q.id)
    this.answers = (await this.surveysData.getRelatedAnswers(relatedQuestionIds));
  }




  async ngOnInit() {
    this.document.body.classList.add('show-body');
    await this.surveysData.setSurveys();
    const survey = this.survey;
    if (!survey) return // for the provided param id there was no survey found
    await this.surveysData.setRelatedQuestions(survey.id);
    await this.setAnswers();
    console.log("answers", this.answers);
    console.log("relatedQuestions", this.surveysData.relatedQuestions());
    console.log("survery", this.survey);
  }

  ngOnDestroy() {
    this.document.body.classList.remove('show-body');
  }
}
