import { Routes } from '@angular/router';
import { HomeViewComponent } from './components/home-view-component/home-view-component';
import { CreateSurveyComponent } from './components/create-survey-component/create-survey-component';

export const routes: Routes = [
    {
        path: "",
        component: HomeViewComponent
    },
    {
        path: "newSurvey",
        component: CreateSurveyComponent
    }
];
