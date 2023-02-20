import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ColumnComponent } from './components/column/column.component';
import { TaskComponent } from './components/column/task.component';

@NgModule({
  declarations: [AppComponent, ColumnComponent, TaskComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
