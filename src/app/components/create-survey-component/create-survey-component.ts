import { Component, inject, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl} from '@angular/forms';
import { DOCUMENT, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-create-survey-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-survey-component.html',
  styleUrls: ['./create-survey-component.scss'],
})
export class CreateSurveyComponent {

  document;
  surveyName: FormControl<string | null>  
  endDate: FormControl<string | null>;
  category: FormControl<string | null>;
  description: FormControl<string | null>;
  questions: FormArray<FormGroup>;
  letter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  constructor(@Inject(DOCUMENT) document: Document) {
    this.document = document
    this.surveyName = new FormControl<string>('', {validators: [Validators.required, Validators.minLength(3)]});
    this.endDate = new FormControl('', Validators.required);
    this.category = new FormControl('');
    this.description = new FormControl<string>('', {validators: [Validators.required, Validators.minLength(3)]});
    this.questions = new FormArray([this.createQuestion()], ) as FormArray<FormGroup>;
 
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
      // answers.removeAt(answerIndex);
      answers.reset();
    }
  }
  

  isDropdownOpen = false;


toggleDropDown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}


  createAnswer(): FormControl<string | null> {
  return new FormControl<string>('', {validators: [Validators.required, Validators.minLength(3)]});
}

createQuestion(): FormGroup {
  return new FormGroup({
    question: new FormControl<string>('', {validators: [Validators.required, Validators.minLength(3)]}),
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


categoryArray: string[] = ['health-Care', 'business', 'lifestyle', 'education', 'population', 'money', 'Environment', 'Work'];
  
categorySelected(category: string) {
  this.category.setValue(category);
}
}
