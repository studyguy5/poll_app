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
  // session_id: string;
}
