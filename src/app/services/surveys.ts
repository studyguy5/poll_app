import { Injectable } from '@angular/core';
import { signal, computed, Signal } from '@angular/core';
import { Survey } from '../interfaces/survey-interface';
import { createClient, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Question } from '../interfaces/survey-interface';
import { statistics } from '../interfaces/survey-interface';
import { computedStatistics } from '../interfaces/survey-interface';


@Injectable({
  providedIn: 'root',
})
export class Surveys {
  [x: string]: any;

  supabase = createClient("https://cejvxxwyidgknkfbpvgp.supabase.co", "sb_publishable_PCQYT5KWUFY1hpKYJZM1XQ_2ej6CAmT")

  surveys = signal<Survey[]>([]);
  filteredSurveys = signal<Survey[]>([]);

  questions = signal<Question[]>([]);

  statistics = signal<statistics[]>([]);
  

  channels: RealtimeChannel | undefined;
  // reference to a component or handler that may implement filterStatistics

  constructor() {
    this.surveys.set([
      {
        "id": 0,
        "title": "erster Title",
        "description": "Erste Beschreibung",
        "deadline": "2023-12-31",
        "category": "erste Kategorie"
      }
    ])
    this.getSurveys()
    this["subscribeToTables"]()
  }
  
  




  async getSurveys() {
    const { data, error } = await this.supabase
      .from('surveyDetail')
      .select('*')
    if (error || !data) return
    this.surveys.set(data)
    console.log(data)

  }
  answerId: number = 1

  async setRelatedQuestions(id: number) {
    const { data, error } = await this.supabase
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

  async getStatisticsData(surveyId: number) {   //holt alle einträge mit der bestimmten survey id
    let { data, error } = await this.supabase
      .from('choosenDetail')
      .select('*')
      .eq('survey_id', surveyId)
      .order('answer_id', { ascending: true })
    console.log(data)
    data ? this.statistics.set(data) : this.statistics.set([])
    return data as statistics[] | null
  }

  

  


  async subscribeToTables() {
    this.channels = this.supabase.channel('custom-all-channels')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'choosenDetail' },
        (payload: { new?: { id?: number; answer_id?: number, question_id?: number, survey_id?: number } }) => {
          console.log('table4', payload)
          this.getStatisticsData(payload.new?.survey_id || 0) // holt alle Einträge zu einer survey_id       
          },
        )
        
      .subscribe()


  }
  
  

  

  ngOnDestroy() {
    this.supabase.removeChannel(this.channels as RealtimeChannel);

  }
}


