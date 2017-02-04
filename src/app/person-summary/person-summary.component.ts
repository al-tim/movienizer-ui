import { LightboxModule } from './../lightbox/lightbox.component';
import { MovieStripModule } from './../movie-strip/movie-strip.component';
import { ShowmoreShowlessModule } from './../showmore-showless/showmore-showless.component';
import { ImagesToPrimeNgPipeModule } from './../common/images-to-primeng.pipe';
import { HorisontalFieldsetModule } from './../horisontal-fieldset/horisontal-fieldset.component';
import { HighlightPipeModule } from './../common/highlight.pipe';
import { ConfiguratonService } from './../service/configuration-service';
import { RouterModule } from '@angular/router';
import { IPersonFullSummary } from './../domain/movie';
import { CommonModule } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';

@Component({
  selector: 'app-person-summary',
  templateUrl: './person-summary.component.html',
  styleUrls: ['./person-summary.component.css']
})
export class PersonSummaryComponent {
  @Input() person: IPersonFullSummary;

  constructor(private config: ConfiguratonService) {}
}

@NgModule({
    imports: [CommonModule, HighlightPipeModule, HorisontalFieldsetModule, ImagesToPrimeNgPipeModule, LightboxModule,
              MovieStripModule, RouterModule, ShowmoreShowlessModule],
    exports: [ PersonSummaryComponent ],
    declarations: [PersonSummaryComponent]
})
export class PersonSummaryModule { }
