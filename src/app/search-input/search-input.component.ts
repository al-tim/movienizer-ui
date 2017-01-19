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
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
  @Input() inputPlaceholder: string;
  @Input() inputStyle: string;
  @Input() debounceTime: number = 0;
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
      .map((e: any) => e.target.value) // extract the value of the input
      .debounceTime(this.debounceTime)               // only once every so often
      .filter((query: string): boolean => { return query !== this.previousEmittedValue; })
      .subscribe({
        next: (query: string) => {
          this.onValueChanged.next(query);
          this.previousEmittedValue = query;
          this.value$ = query;
        },
        error: (err: any) => { // on error
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
