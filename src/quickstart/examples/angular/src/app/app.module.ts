import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SpreadsheetViewerComponent } from '../spreadsheet-viewer/spreadsheet-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    SpreadsheetViewerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
