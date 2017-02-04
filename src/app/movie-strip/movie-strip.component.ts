import { MovieWidgetModule } from './../movie-widget/movie-widget.component';
import { CommonModule } from '@angular/common';
import { IMovie } from './../domain/movie';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/primeng';

@Component({
  selector: 'app-movie-strip',
  templateUrl: './movie-strip.component.html',
  styleUrls: ['./movie-strip.component.css']
})
export class MovieStripComponent implements OnInit {
  @Input() movies: IMovie[];
  @Input() showAll: boolean = false;
  @Input() minSize: number = 10;
  public showMoreLess: boolean;

  public ngOnInit(): void {
    this.showMoreLess = (this.movies && this.movies.length > this.minSize);
  }
}

@NgModule({
    imports: [ButtonModule, CommonModule, MovieWidgetModule],
    exports: [MovieStripComponent],
    declarations: [MovieStripComponent]
})
export class MovieStripModule { }
