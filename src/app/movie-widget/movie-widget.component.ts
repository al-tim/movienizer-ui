import { RouterModule } from '@angular/router';
import { ConfiguratonService } from './../service/configuration-service';
import { CommonModule } from '@angular/common';
import { HighlightPipeModule } from './../common/highlight.pipe';
import { IMovie } from './../domain/movie';
import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'app-movie-widget',
  templateUrl: './movie-widget.component.html'
})
export class MovieWidgetComponent {
  @Input() movie: IMovie;

  constructor(private config: ConfiguratonService) {}
}

@NgModule({
    imports: [CommonModule, HighlightPipeModule, RouterModule],
    exports: [MovieWidgetComponent],
    declarations: [MovieWidgetComponent]
})
export class MovieWidgetModule { }
