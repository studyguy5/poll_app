import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-create-survey-component',
  imports: [],
  templateUrl: './create-survey-component.html',
  styleUrl: './create-survey-component.scss',
})
export class CreateSurveyComponent {

  // openDropDown(){
  //   let drop = document.querySelector('.dropDownList') as HTMLDivElement
  //   drop.style.transition = 'all 0.5s ease-in-out';
  //   drop.style.opacity = '1';
  //   drop.style.height = '300px';
  // }


  isDropdownOpen = false;


toggleDropDown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}
  
}
