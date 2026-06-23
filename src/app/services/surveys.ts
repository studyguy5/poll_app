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

  questions = signal<Question[] | null>([]);
  
  
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
  }

  
  

  async getSurveys(){
    const { data, error } = await this.supabase
      .from('surveyDetail')
      .select('*')

    if (error || !data) return
    this.surveys.set(data)
    console.log(data)
  }

  async getRelatedQuestions(id: number): Promise<void> {
    const {data, error} = await this.supabase
    .from('questionDetail')
    .select('*')
    .eq('id', id)
    if(error || !data) return
    this.questions.set(data)
    console.log(data)
  }
}


