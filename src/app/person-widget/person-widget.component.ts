import { RouterModule } from '@angular/router';
import { ConfiguratonService } from './../service/configuration-service';
import { CommonModule } from '@angular/common';
import { HighlightPipeModule } from './../common/highlight.pipe';
import { IPerson } from './../domain/movie';
import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'app-person-widget',
  templateUrl: './person-widget.component.html'
})
export class PersonWidgetComponent {
  @Input() person: IPerson;

  constructor(private config: ConfiguratonService) {}
}

@NgModule({
    imports: [CommonModule, HighlightPipeModule, RouterModule],
    exports: [PersonWidgetComponent],
    declarations: [PersonWidgetComponent]
})
export class PersonWidgetModule { }
