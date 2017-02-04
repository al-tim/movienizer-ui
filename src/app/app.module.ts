import { ConfiguratonService } from './service/configuration-service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { GrowlModule } from 'primeng/primeng';

import { MovieService } from './service/movieservice';
import { MoviesModule, MoviesComponent } from './movies/movies.component';
import { PersonOverlayModule, PersonOverlayComponent } from './person-overlay/person-overlay.component';
import { MovieOverlayComponent, MovieOverlayModule } from './movie-overlay/movie-overlay.component';

const ROUTES: Routes = [
  {path: '', redirectTo: 'movies', pathMatch: 'full'},
  {path: 'movies', component: MoviesComponent},
  {path: 'person/:id', component: PersonOverlayComponent, outlet: 'popupOverlay'},
  {path: 'movie/:id', component: MovieOverlayComponent, outlet: 'popupOverlay'},
  { path: '**', redirectTo: 'movies'}
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GrowlModule,
    HttpModule,
    JsonpModule,
    MoviesModule,
    MovieOverlayModule,
    PersonOverlayModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [ConfiguratonService, MovieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
