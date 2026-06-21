import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Survey } from '../interfaces/survey-interface';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Surveys {
  
  supabase = createClient("https://cejvxxwyidgknkfbpvgp.supabase.co", "sb_publishable_PCQYT5KWUFY1hpKYJZM1XQ_2ej6CAmT")
  
  surveys = signal<Survey[]>([]);
  
  
  constructor() {
    this.surveys.set([
      {
        "title": "erster Title",
        "description": "Erste Beschreibung",
        "deadline": "2023-12-31",
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
}


