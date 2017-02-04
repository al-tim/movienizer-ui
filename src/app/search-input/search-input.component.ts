import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Component, ElementRef, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switch';

@Component({
  selector: 'app-search-input',
  template: `<input type="text" pInputText [size]="size" [placeholder]="inputPlaceholder" class="ui-column-filter ui-widget" [ngStyle]="inputStyle" [(ngModel)]="value$">`
})
export class SearchInputComponent implements OnInit {
  @Input() inputPlaceholder: string;
  @Input() inputStyle: string;
  @Input() debounceTime: number = 10;
  @Input() size: number = 50;
  private value$: string;
  @Input() set value(newValue: string) {
    if (newValue !== this.value$) {
      this.value$ = newValue;
    }
  }
  get value(): string {
    return this.value$;
  }
  @Output() onValueChanged: EventEmitter<string> = new EventEmitter<string>();
  private previousEmittedValue: string = '';

  constructor(private el: ElementRef) {
  }

  public ngOnInit(): void {
    Observable.fromEvent(this.el.nativeElement, 'keyup')
      // tslint:disable-next-line:no-any
      .map((e: any) => e.target.value) // extract the value of the input
      .debounceTime(this.debounceTime) // only once every so often
      .filter((query: string): boolean => { return query !== this.previousEmittedValue; })
      .subscribe({
        next: (query: string) => {
          this.onValueChanged.next(query);
          this.previousEmittedValue = query;
        },
        error: (err) => { // on error: this should not really happen. So just log it.
                 console.log(err);
               }
        }
      );
  }
}

@NgModule({
  declarations: [
    SearchInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [SearchInputComponent]
})
export class SearchInputModule { }
