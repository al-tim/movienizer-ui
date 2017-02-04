import { LightboxModule } from './../lightbox/lightbox.component';
import { PersonsStripModule } from './../persons-strip/persons-strip.component';
import { ConfiguratonService } from './../service/configuration-service';
import { ShowmoreShowlessModule } from './../showmore-showless/showmore-showless.component';
import { HorisontalFieldsetModule } from './../horisontal-fieldset/horisontal-fieldset.component';
import { ImagesToPrimeNgPipeModule } from './../common/images-to-primeng.pipe';
import { IMovie } from './../domain/movie';
import { CommonModule } from '@angular/common';
import { HighlightPipeModule } from './../common/highlight.pipe';
import { Component, NgModule, Input } from '@angular/core';

@Component({
  selector: 'app-movie-summary',
  templateUrl: './movie-summary.component.html',
  styleUrls: ['./movie-summary.component.css']
})
export class MovieSummaryComponent {
  @Input() movie: IMovie;

  constructor(private config: ConfiguratonService) {}
}

@NgModule({
    imports: [CommonModule, HighlightPipeModule, HorisontalFieldsetModule, ImagesToPrimeNgPipeModule, LightboxModule,
              PersonsStripModule, ShowmoreShowlessModule],
    exports: [MovieSummaryComponent],
    declarations: [MovieSummaryComponent]
})
export class MovieSummaryModule { }
