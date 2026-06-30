import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Survey } from '../interfaces/survey-interface';
import { createClient } from '@supabase/supabase-js';
import { Question } from '../interfaces/survey-interface';

@Injectable({
  providedIn: 'root',
})
export class Surveys {
  
  supabase = createClient("https://cejvxxwyidgknkfbpvgp.supabase.co", "sb_publishable_PCQYT5KWUFY1hpKYJZM1XQ_2ej6CAmT")
  
  surveys = signal<Survey[]>([]);

  questions = signal<Question[]>([]);
  
  
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
    this.collectAnswerId(2)
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

  async collectAnswerId(id: number) {
    this.surveys().find((survey) => survey.id === id);
    // const idParam = this.route.snapshot.paramMap.get('id');
    const answer = await this.setRelatedQuestions(id)
    console.log(answer)
    if(answer)
    answer.map((answer: number) => {
      this.answerId = answer
    })
  }

  // async getRelatedAnswers(id: number): Promise<void> {
  //   const {data, error} = await this.supabase
  //   .from('answerDetail')
  //   .select('*')
  //   .eq('id', id)
  //   if(error || !data) return
  //   console.log(data)
  // }

  async getRelatedAnswers(answerId: number): Promise<object[]> {
    console.log(answerId)
    let { data, error } = await this.supabase
      .from('answerDetail')
      .select('*')
      .eq('question', answerId)
      console.log(data)
    return data as any | null
  }
          
}


