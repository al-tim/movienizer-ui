import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { GrowlModule } from 'primeng/primeng';

import { MovieService } from './service/movieservice';
import { MoviesModule } from './movies/movies.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GrowlModule,
    HttpModule,
    MoviesModule,
    JsonpModule,
    ReactiveFormsModule
  ],
  providers: [MovieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
