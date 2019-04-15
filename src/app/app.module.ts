import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DynamicElementComponent } from './dynamic-element/dynamic-element.component';


@NgModule({
  declarations: [
    AppComponent,
    DynamicElementComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
