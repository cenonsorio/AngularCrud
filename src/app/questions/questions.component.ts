import { Component, OnInit, ViewChild } from '@angular/core';  
import { FormBuilder, Validators } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { QuestionsService } from '../questions.service';  
import { Questions } from '../questions';  
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';  
import { MatDialog } from '@angular/material/dialog';  
import { MatTableDataSource, } from '@angular/material/table';  
import { MatPaginator } from '@angular/material/paginator';  
import { MatSort } from '@angular/material/sort';  
import { SelectionModel } from '@angular/cdk/collections';  
   
@Component({  
  selector: 'app-questions',  
  templateUrl: './questions.component.html',  
  styleUrls: ['./questions.component.css']
})  
export class QuestionsComponent implements OnInit {  
  dataSaved = false;  
  questionsForm: any;  
  dataSource: MatTableDataSource<Questions>;  
  selection = new SelectionModel<Questions>(true, []);  
  questionIdUpdate: any;  
  massage = null;  
  CountryId = null;  
  StateId = null;  
  CityId = null;  
  SelectedDate = null;  
  isMultitple = true;  
  isYesOrNo = false;  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';  
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';  
  displayedColumns: string[] = ['question', 'order', 'points', 'answers', 'question_types', 'Edit', 'Delete'];  
  // @ViewChild(MatPaginator) paginator: MatPaginator;  
  // @ViewChild(MatSort) sort: MatSort;  
   
   
  constructor(private formbulider: FormBuilder, private questionsService: QuestionsService, private _snackBar: MatSnackBar, public dialog: MatDialog) {  
    this.questionsService.getAllQuestions().subscribe(data => {  
      this.dataSource = new MatTableDataSource(data);  
      // this.dataSource.paginator = this.paginator;  
      // this.dataSource.sort = this.sort;  
    });  
  }  
   
  ngOnInit() {  
    this.questionsForm = this.formbulider.group({  
      question: ['', [Validators.required]],  
      order: ['', [Validators.required]], 
      points: ['', [Validators.required]],  
      question_types: ['', [Validators.required]],
      answers: ['', [Validators.required]] 
    });  
    this.loadAllQuestions();  
    // this.dataSource.paginator = this.paginator;  
    // this.dataSource.sort = this.sort;  
  }  
   
  isAllSelected() {  
    const numSelected = this.selection.selected.length;  
    const numRows = !!this.dataSource && this.dataSource.data.length;  
    return numSelected === numRows;  
  }  
   
  masterToggle() {  
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));  
  }  
   
  checkboxLabel(row: Questions): any {  
    if (!row) {  
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;  
    }
    
    if (row.id != null) {
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;  
    }

  }  
  // DeleteData() {  
  //   debugger;  
  //   const numSelected = this.selection.selected;  
  //   if (numSelected.length > 0) {  
  //     if (confirm("Are you sure to delete items ")) {  
  //       this.questionsService.deleteData(numSelected).subscribe(result => {  
  //         this.SavedSuccessful(2);  
  //         this.loadAllQuestions();  
  //       })  
  //     }  
  //   } else {  
  //     alert("Select at least one row");  
  //   }  
  // }  
   
  applyFilter(filterValue: string) {  
    this.dataSource.filter = filterValue.trim().toLowerCase();  
   
    if (this.dataSource.paginator) {  
      this.dataSource.paginator.firstPage();  
    }  
  }  
   
  loadAllQuestions() {  
    this.questionsService.getAllQuestions().subscribe(data => {  
      this.dataSource = new MatTableDataSource(data);  
      // this.dataSource.paginator = this.paginator;  
      // this.dataSource.sort = this.sort;  
    });  
  }  
  onFormSubmit() {  
    this.dataSaved = false;  
    const questions = this.questionsForm.value;  
    this.CreateEmployee(questions);  
    this.questionsForm.reset();  
  }  
  loadQuestionToEdit(id: string) {  
    this.questionsService.getQuestionsById(id).subscribe(questions => {  
      this.massage = null;  
      this.dataSaved = false;  
      this.questionIdUpdate = questions.id;  
      this.questionsForm.controls['question'].setValue(questions.question);  
      this.questionsForm.controls['order'].setValue(questions.order);
      this.questionsForm.controls['points'].setValue(questions.points);  
      this.questionsForm.controls['question_types'].setValue(questions.question_types);  
      this.questionsForm.controls['answers'].setValue(questions.answers);  
      this.isMultitple = questions.question_types.trim() == "multiple" ? true : false;  
      this.isYesOrNo = questions.question_types.trim() == "yesorno" ? true : false;  
    });  
   
  }  
  CreateEmployee(questions: Questions) {
    if (this.questionIdUpdate == null) {  
   
      this.questionsService.createQuestions(questions).subscribe(  
        () => {  
          this.dataSaved = true;  
          this.SavedSuccessful(1);  
          this.loadAllQuestions();  
          this.questionIdUpdate = null;  
          this.questionsForm.reset();  
        }  
      );  
    } else {  
      questions.id = this.questionIdUpdate;  
      this.questionsService.updateQuestions(questions).subscribe(() => {  
        this.dataSaved = true;  
        this.SavedSuccessful(0);  
        this.loadAllQuestions();  
        this.questionIdUpdate = null;  
        this.questionsForm.reset();  
      });  
    }  
  }  
  deleteQuestion(employeeId: string) {  
    if (confirm("Are you sure you want to delete this ?")) {  
      this.questionsService.deleteQuestionsById(employeeId).subscribe(() => {  
        this.dataSaved = true;  
        this.SavedSuccessful(2);  
        this.loadAllQuestions();  
        this.questionIdUpdate = null;  
        this.questionsForm.reset();  
   
      });  
    }  
   
  }  
   
  resetForm() {  
    this.questionsForm.reset();  
    this.massage = null;  
    this.dataSaved = false;  
    this.isMultitple = true;  
    this.isYesOrNo = false;  
    this.loadAllQuestions();  
  }  
   
  SavedSuccessful(isUpdate: any) {  
    if (isUpdate == 0) {  
      this._snackBar.open('Record Updated Successfully!', 'Close', {  
        duration: 2000,  
        horizontalPosition: this.horizontalPosition,  
        verticalPosition: this.verticalPosition,  
      });  
    }  
    else if (isUpdate == 1) {  
      this._snackBar.open('Record Saved Successfully!', 'Close', {  
        duration: 2000,  
        horizontalPosition: this.horizontalPosition,  
        verticalPosition: this.verticalPosition,  
      });  
    }  
    else if (isUpdate == 2) {  
      this._snackBar.open('Record Deleted Successfully!', 'Close', {  
        duration: 2000,  
        horizontalPosition: this.horizontalPosition,  
        verticalPosition: this.verticalPosition,  
      });  
    }  
  }  
}  