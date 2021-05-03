import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs';  
import { Questions} from './questions';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  url = 'http://restfulapi.localhost/api/questions';  
   
  constructor(private http: HttpClient) { }  
   
  getAllQuestions(): Observable<Questions[]> {  
    return this.http.get<Questions[]>(this.url);  
  }  
   
  getQuestionsById(id: string): Observable<Questions> {  
    return this.http.get<Questions>(this.url + '/' + id);  
  }  
   
  createQuestions(questions: Questions): Observable<Questions> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };  
    return this.http.post<Questions>(this.url,  
    questions, httpOptions);  
  }  
   
  updateQuestions(questions: Questions): Observable<Questions> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };  
   
    return this.http.put<Questions>(this.url + '/' + questions.id,  
    questions, httpOptions);  
  }  
   
  deleteQuestionsById(id: string): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };  
    return this.http.delete<number>(this.url + '/' + id,  
      httpOptions);  
  }  
   
  //@TODO
  // getCountry(): Observable<Country[]> {  
  //   return this.http.get<Country[]>(this.url + '/Country');  
  // }  
   
  // getState(CountryId: string): Observable<State[]> {  
  //   return this.http.get<State[]>(this.url + '/Country/' + CountryId + '/State');  
  // }  
   
  // getCity(StateId: string): Observable<City[]> {  
  //   return this.http.get<City[]>(this.url + '/State/' + StateId + '/City');  
  // }  
   
  // deleteData(user: Questions[]): Observable<string> {  
  //   const httpOptions = {  
  //     headers: new HttpHeaders({  
  //       'Content-Type': 'application/json'  
  //     })  
  //   };  
  //   return this.http.post<string>(this.url + '/DeleteRecord/', user, httpOptions);  
  // } 
}
