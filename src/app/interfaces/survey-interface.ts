export interface Survey {
  id: number;
  title: string;
  description: string;
  deadline: string;
  category: string;

}

export interface Question {
  question: string;
  allowMultipleAnswers: boolean;
  answers: string[];
}
