import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ColumnComponent } from './components/column/column.component';
import { TaskComponent } from './components/column/task.component';

@NgModule({
  declarations: [AppComponent, ColumnComponent, TaskComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
