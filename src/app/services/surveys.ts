import { Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Question, Survey } from '../interfaces/survey-interface';

@Injectable({
  providedIn: 'root',
})
export class Surveys {

  supabase = createClient("https://cejvxxwyidgknkfbpvgp.supabase.co", "sb_publishable_PCQYT5KWUFY1hpKYJZM1XQ_2ej6CAmT")
  surveys = signal<Survey[]>([]);
  relatedQuestions = signal<Question[]>([]);


  constructor() {
    this.surveys.set([
      { "id": 0,
        "title": "erster Title",
        "description": "Erste Beschreibung",
        "deadline": "2023-12-31",
        "category": "erste Kategorie"
      }
    ])
    this.setSurveys()
  }




  async setSurveys(){
    const { data, error } = await this.supabase
      .from('surveyDetail')
      .select('*')

    if (error || !data) return
    this.surveys.set(data)
    console.log(data)
  }
  answerId = 0;

  async setRelatedQuestions(surveyId: number){
    const {data, error} = await this.supabase
    .from('questionDetail')
    .select('*')
    .eq('survey', surveyId)
    // we swallow the error
    if(error || !data)  this.relatedQuestions.set([]);
    this.relatedQuestions.set(data as Question[]);
  }

  async getRelatedAnswers(answerIds: number[]): Promise<Object[]> {
    let { data, error } = await this.supabase
      .from('answerDetail')
      .select('*')
      .in('question', answerIds)
    if (error || !data) return [];
    return data as Object[];
  }

}


