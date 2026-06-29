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
