import { Component, inject, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-create-survey-component',
  imports: [ReactiveFormsModule],
  templateUrl: './create-survey-component.html',
  styleUrl: './create-survey-component.scss',
})
export class CreateSurveyComponent {

  document;
  surveyName;
  endDate;
  category;
  description;
  questions;
  letter: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  constructor(@Inject(DOCUMENT) document: Document) {
    this.document = document
    this.surveyName = new FormControl('', Validators.required);
    this.endDate = new FormControl('', Validators.required);
    this.category = new FormControl('');
    this.description = new FormControl('');
    this.questions = new FormArray([this.createQuestion()]);
 
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

  getAnswers(questionIndex: number): FormArray {
  return this.questions.at(questionIndex).get('answers') as FormArray;
}

  addAnswer(questionIndex: number) {
  this.getAnswers(questionIndex).push(this.createAnswer());
}
  

  isDropdownOpen = false;


toggleDropDown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}


  createAnswer(): FormControl | FormGroup {
  return new FormControl('');
}

createQuestion(): FormGroup {
  return new FormGroup({
    question: new FormControl(''),
    allowMultipleAnswers: new FormControl(false),
    answers: new FormArray([
      this.createAnswer(),
      this.createAnswer()
    ])
  });
}

  
}
