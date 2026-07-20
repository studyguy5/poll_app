import { computed } from "@angular/core";

export interface Survey {
  id: number;
  title: string;
  description: string;
  deadline: string;
  category: string;

}

export interface Question {
  id: number;
  question: string;
  allowMultipleAnswers: boolean;
  answers:Answer[];
  survey: number
}

export interface Answer {
  id: number;
  answer: string;
  question: number;
}

export interface CompletedSurvey {
  survey_id: number;
  question_id: number;
  answer_id: Number | undefined;
  submission_id: string;
}

export interface statistics {
  survey_id: number;
  question_id: number;
  answer_id: number;
  created_at: string;
  submission_id: string;
  xTimesSurveyFilled: number
  idsOfAnswer: number[]
}

export interface computedStatistics {
  xTimesSurveyFilled: number
  idsOfAnswer: number[]
}
