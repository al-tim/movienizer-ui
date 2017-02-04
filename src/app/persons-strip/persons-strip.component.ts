import { PersonWidgetModule } from './../person-widget/person-widget.component';
import { CommonModule } from '@angular/common';
import { IPerson } from './../domain/movie';
import { Component, Input, NgModule, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/primeng';

@Component({
  selector: 'app-persons-strip',
  templateUrl: './persons-strip.component.html',
  styleUrls: ['./persons-strip.component.css']
})
export class PersonsStripComponent implements OnInit {
  @Input() persons: IPerson[];
  @Input() showAll: boolean = false;
  @Input() minSize: number = 10;
  public showMoreLess: boolean;

  public ngOnInit(): void {
    this.showMoreLess = (this.persons && this.persons.length > this.minSize);
  }
}

@NgModule({
    imports: [ButtonModule, CommonModule, PersonWidgetModule],
    exports: [PersonsStripComponent],
    declarations: [PersonsStripComponent]
})
export class PersonsStripModule { }
