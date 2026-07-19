import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Survey } from '../interfaces/survey-interface';
import { createClient, RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Question } from '../interfaces/survey-interface';
import { statistics } from '../interfaces/survey-interface';

@Injectable({
  providedIn: 'root',
})
export class Surveys {

  supabase = createClient("https://cejvxxwyidgknkfbpvgp.supabase.co", "sb_publishable_PCQYT5KWUFY1hpKYJZM1XQ_2ej6CAmT")

  surveys = signal<Survey[]>([]);
  filteredSurveys = signal<Survey[]>([]);

  questions = signal<Question[]>([]);

  statistics = signal<statistics[]>([]);

  channels: RealtimeChannel | undefined;
  filterStatistics: any;
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
    this.subscribeToTables()
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
        { event: '*', schema: 'public', table: 'surveyDetail' },
        (payload) => {
          console.log('table1', payload)
          this.getSurveys()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questionDetail' },
        (payload: { new?: { id?: number; question?: string, allowMultipleAnswers?: boolean, survey?: number } }) => {

          console.log('table2', payload)
          this.setRelatedQuestions(payload.new?.survey || 0)

          //Fragen selber werden aktualisiert aber antworten verschwinden leider
          




        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'answerDetail' },
        (payload: { new?: { id?: number; answer?: string, question?: number } }) => {
          console.log('table3', payload)
          // this.getRelatedAnswers(payload.new?.question || 0)
          
          
          
        }
        
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'choosenDetail' },
        (payload: { new?: { id?: number; answer_id?: number, question_id?: number, survey_id?: number } }) => {
          console.log('table4', payload)
          this.getStatisticsData(payload.new?.survey_id || 0)
          // this.statistics.update((statistics) => statistics.map(
          //   (statistic) => statistic.answer_id === payload.new?.answer_id ? { ...statistic, answer_id: payload.new?.answer_id } : statistic)
          
          // ),
          this.filterStatistics()
          },
        )
        
      .subscribe()


  }
  

  

  ngOnDestroy() {
    this.supabase.removeChannel(this.channels as RealtimeChannel);

  }
}


