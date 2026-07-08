import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Survey } from '../interfaces/survey-interface';
import { createClient } from '@supabase/supabase-js';
import { Question } from '../interfaces/survey-interface';
import { statistics } from '../interfaces/survey-interface';

@Injectable({
  providedIn: 'root',
})
export class Surveys {
  
  supabase = createClient("https://cejvxxwyidgknkfbpvgp.supabase.co", "sb_publishable_PCQYT5KWUFY1hpKYJZM1XQ_2ej6CAmT")
  
  surveys = signal<Survey[]>([]);

  questions = signal<Question[]>([]);
  
  statistics = signal<statistics[]>([]);
  
  constructor() {
    this.surveys.set([
      { "id": 0,
        "title": "erster Title",
        "description": "Erste Beschreibung",
        "deadline": "2023-12-31",
        "category": "erste Kategorie"
      }
    ])
    this.getSurveys()
    // this.getStatisticsData()
  }

  
  

  async getSurveys(){
    const { data, error } = await this.supabase
      .from('surveyDetail')
      .select('*')

    if (error || !data) return
    this.surveys.set(data)
    console.log(data)
  }
  answerId: number = 1

  async setRelatedQuestions(id: number) {
    const {data, error} = await this.supabase
    .from('questionDetail')
    .select('*')
    .eq('survey', id)
    // .eq('id', this.answerId)
    this.questions.set(data ?? [])
    console.log(data)
    // console.log(this.answerId) 
    return data
  }



  async getRelatedAnswers(answerId: number): Promise<object[]> {
    console.log(answerId)
    let { data, error } = await this.supabase
      .from('answerDetail')
      .select('*')
      .eq('question', answerId)
      console.log(data)
    return data as any | null
  }

 async getStatisticsData(surveyId: number) {
 let { data, error } = await this.supabase
   .from('choosenDetail')
   .select('*')
   .eq('survey_id', surveyId)
   console.log(data)
   data ? this.statistics.set(data) : this.statistics.set([])
   return data as statistics[] | null         
}
}


