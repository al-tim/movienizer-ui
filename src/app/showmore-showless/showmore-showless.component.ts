import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'app-showmore-showless',
  templateUrl: './showmore-showless.component.html',
  styleUrls: ['./showmore-showless.component.css']
})
export class ShowmoreShowlessComponent implements OnInit {
  @Input() rows: number = 10;
  @Input() lineHeightEms: number = 1.2;
  @Input() textHtml: string;
  @Input() showAll: boolean = false;
  private dummyRows: number[];
  private fillingText: string;

  public ngOnInit(): void {
    this.dummyRows = Array(this.rows - 1).fill(0);
    this.fillingText = Array(this.rows - 1).fill('&nbsp;<br/>').join('');
  }
}

@NgModule({
    imports: [CommonModule],
    exports: [ShowmoreShowlessComponent],
    declarations: [ShowmoreShowlessComponent]
})
export class ShowmoreShowlessModule { }
