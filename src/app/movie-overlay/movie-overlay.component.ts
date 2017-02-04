import { Message } from 'primeng/components/common/api';
import { GrowlModule } from 'primeng/primeng';
import { IMovie } from './../domain/movie';
import { MovieService } from './../service/movieservice';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MovieSummaryModule } from './../movie-summary/movie-summary.component';
import { OverlayDialogModule } from './../overlay-dialog/overlay-dialog.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit, NgModule } from '@angular/core';

@Component({
  selector: 'app-movie-overlay',
  templateUrl: './movie-overlay.component.html'
})
export class MovieOverlayComponent implements OnInit {
  private movie: IMovie;
  public msgs: Message[] = [];
  private loading: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private movieService: MovieService) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.switchMap((params: Params) => this.movieService.getMoviesById([+params['id']])).subscribe(
      (movies: IMovie[]) => {
        if (movies && movies.length > 0) { this.movie = movies[0]; }
        this.loading = false;
      },
      error => this.msgs.push({severity: 'error', summary: 'Failed to fetch movie', detail: error}),
      () => (this.loading = false)
    );
  }
}

@NgModule({
    imports: [ CommonModule, GrowlModule, MovieSummaryModule, OverlayDialogModule ],
    exports: [ MovieOverlayComponent ],
    declarations: [ MovieOverlayComponent ]
})
export class MovieOverlayModule { }
