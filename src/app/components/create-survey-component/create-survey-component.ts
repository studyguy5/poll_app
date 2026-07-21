import { Component, inject, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { DOCUMENT, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';
import { Question, Answer } from '../../interfaces/survey-interface';
import { Router } from '@angular/router';
export type FormQuestion = {
  question: string;
  allowMultipleAnswers: boolean;
  answers: string[];
  id: number;
}

@Component({
  selector: 'app-create-survey-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-survey-component.html',
  styleUrls: ['./create-survey-component.scss'],
})
export class CreateSurveyComponent {
  supabase = createClient("https://cejvxxwyidgknkfbpvgp.supabase.co", "sb_publishable_PCQYT5KWUFY1hpKYJZM1XQ_2ej6CAmT")
  categoryArray: string[] = ['health-Care', 'business', 'lifestyle', 'education', 'population', 'money', 'Environment', 'Work'];

  document: Document;
  surveyName: FormControl<string | null>;
  endDate: FormControl<string | null>;
  category: FormControl<string | null>;
  description: FormControl<string | null>;
  questions: FormArray<FormGroup>;
  letter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  router: Router
  constructor(@Inject(DOCUMENT) document: Document, router: Router) {
    this.router = router
    this.document = document;
    this.surveyName = new FormControl<string | null>('', { validators: [Validators.required, Validators.minLength(3)] });
    this.endDate = new FormControl<string | null>('', { validators: [Validators.required] });
    this.category = new FormControl<string | null>('');
    this.description = new FormControl<string | null>('', { validators: [Validators.required, Validators.minLength(3)] });
    this.questions = new FormArray([this.createQuestion()],) as FormArray<FormGroup>;

  }

  ngOnInit() {
    this.document.body.classList.add('survey-body');
  }

  ngOnDestroy() {
    this.document.body.classList.remove('survey-body');
  }

  addQuestion() {
    this.questions.push(this.createQuestion());
  }

  getAnswers(questionIndex: number): FormArray<FormControl<string | null>> {
    return this.questions.at(questionIndex).get('answers') as FormArray<FormControl<string | null>>;
  }

  addAnswer(questionIndex: number) {
    this.getAnswers(questionIndex).push(this.createAnswer());
  }

  deleteAnswer(questionIndex: number, answerIndex: number) {
    const answers = this.getAnswers(questionIndex);
    if (answerIndex >= 0 && answerIndex < answers.length) {
      answers.reset();
    }
  }


  isDropdownOpen = false;

  
  toggleDropDown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  async submit() {
    const survey = await this.uploadMainSurveyData()
    const formQuestions = this.questions.getRawValue() as FormQuestion[]; 
    const questionsData = await this.uploadQuestionsData(survey, formQuestions)  
    let data = questionsData as FormQuestion[]
    await this.uploadAnswersData(data, formQuestions)
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000)
}

async uploadMainSurveyData(){
    const payload = {
      title: this.surveyName.value,
      deadline: this.endDate.value,
      category: this.category.value,
      description: this.description.value,
    }
    const { data: survey, error: surveyError } = await this.supabase.
    from('surveyDetail')
      .insert(payload)
      .select()
      .single()
    
    if (surveyError) throw surveyError
    return survey
  }

  async uploadQuestionsData(survey: { id: number; }, formQuestions: FormQuestion[]){ 
      const questions = formQuestions.map(questions => ({
        survey: survey.id,
        question: questions.question,
        allowMultipleAnswers: questions.allowMultipleAnswers,
      }));
      const { data: questionsData, error } = await this.supabase.
        from('questionDetail')
        .insert(questions)
        .select()
      console.log(questionsData)
      if (error) throw error
      return questionsData;
  }

  async uploadAnswersData(data: FormQuestion[], formQuestions: FormQuestion[]) {
      const answers = formQuestions.flatMap((question, index: number) => {
        const questionId = data ? data[index].id : null;
        return question.answers.map((answer: string) => ({
          question: questionId,
          answer: answer
        }));
      });
      const answerData = await this.supabase.
        from('answerDetail')
        .insert(answers)
        .select()
        console.log(answerData)
  }

  createAnswer(): FormControl<string | null> {
    return new FormControl<string | null>('', { validators: [Validators.required, Validators.minLength(3)] });
  }
  
  createQuestion(): FormGroup {
    return new FormGroup({
      question: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(3)] }),
      allowMultipleAnswers: new FormControl<boolean>(false),
      answers: new FormArray<FormControl<string | null>>([
        this.createAnswer(),
        this.createAnswer()
      ])
    });
  }

  asFormControl(control: AbstractControl | null): FormControl {
    return control as FormControl;
  }

  categorySelected(category: string) {
    this.category.setValue(category);
    this.document.querySelectorAll('.dropdownButton')?.forEach((button: Element) =>
      button.innerHTML = `${category}<img src=\"assets/arrow_drop_down.svg\">`

    );
    this.toggleDropDown();
  }

  prefill() {
    this.surveyName.setValue('Health Care');
    this.category.setValue('health-Care');
    this.description.setValue('Health Care Survey');
    this.endDate.setValue('2023-12-31');
    this.questions.at(0).get('question')?.setValue('Health Care Survey Question');
    this.questions.at(0).get('answers')?.setValue(['Yes', 'No']);
  }

}
