import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InplaceModule } from './../inplace-input/inplace-input.component';
import { SortOrder } from '../domain/movie';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { SliderModule } from 'primeng/primeng';

@Component({
  selector: 'app-input-with-slider-header',
  templateUrl: './input-with-slider-header.component.html',
  styleUrls: ['./input-with-slider-header.component.css']
})
export class InputWithSliderHeaderComponent implements OnInit {
  private min$: number;
  private sliderMin: number;
  @Input() header: string;
  private step$: number = 1;
  private fractionalStep1$: number = 1;
  private fractionalStep2$: number = 1;
  private precision: number = 0;
  @Input() get step(): number { return this.step$; }
           set step(newValue: number) {
             this.step$ = newValue;
             let fractionalPartOfMax: string = this.step$.toString().split(/[,]|[.]/)[1];
             this.precision =  (fractionalPartOfMax ? fractionalPartOfMax.length : 0);
             this.size = ((this.max$) ? this.max$ : 10).toString().split(/[,]|[.]/)[0].length + (this.precision === 0 ? 0 : this.precision + 1);
             this.fractionalStep2$ = Math.pow(10, this.precision);
             this.fractionalStep1$ = this.step$ * this.fractionalStep2$;
             this.sliderMin = Math.floor(this.min$ * this.fractionalStep2$ / this.fractionalStep1$);
             this.sliderMax = Math.ceil(this.max$ * this.fractionalStep2$ / this.fractionalStep1$);
           }
  @Input() get min(): number {return this.min$; }
           set min(value: number) {
             this.min$ = value;
             this.sliderMin = Math.floor(this.min$ * this.fractionalStep2$ / this.fractionalStep1$);
             if (this.fromValue < value) {
               this.fromValue = value;
               this.onFromValueChange(value);
             }
           };
  private max$: number;
  private sliderMax: number;
  @Input() get max(): number { return this.max$; };
           set max(value: number) {
             this.max$ = value;
             this.sliderMax = Math.ceil(this.max$ * this.fractionalStep2$ / this.fractionalStep1$);
             this.size = ((this.max$) ? this.max$ : 10).toString().split(/[,]|[.]/)[0].length + (this.precision === 0 ? 0 : this.precision + 1);
             if (this.toValue > value) {
               this.toValue = value;
               this.onToValueChange(value);
             }
           }
  private sortOrder$: SortOrder;
  @Input() set sortOrder(value: SortOrder) { this.sortOrder$ = value; };
  private value$: Array<number>;
  @Input() get value(): Array<number> { return this.value$; };
           set value(value: Array<number>) {
             this.value$ = value ? [Math.floor(value[0] * this.fractionalStep2$ / this.fractionalStep1$) * this.fractionalStep1$ / this.fractionalStep2$,
                                    Math.ceil(value[1] * this.fractionalStep2$ / this.fractionalStep1$) * this.fractionalStep1$ / this.fractionalStep2$]
                                 : [this.min, this.max];
             this.valueRange = [this.value$[0] * this.fractionalStep2$ / this.fractionalStep1$, this.value$[1] * this.fractionalStep2$ / this.fractionalStep1$];
             this.fromValue = this.value$[0];
             this.toValue = this.value$[1];
           }
  @Output() valueChange: EventEmitter<Array<number>> = new EventEmitter();
  @Output() sortOrderChange: EventEmitter<SortOrder> = new EventEmitter();
  private valueRange: Array<number>;
  private fromValue: number;
  private toValue: number;
  private size: number;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.value$ === undefined) {
      this.valueRange = this.value$ = [this.min, this.max];
    } else {
      this.fromValue = this.value$[0];
      this.toValue = this.value$[1];
    }
  }

  public onSliderChange(event: {values: Array<number>}): void {
    this.valueRange = [event.values[0], event.values[1]];
    this.fromValue = event.values[0] * this.fractionalStep1$ / this.fractionalStep2$;
    this.toValue = event.values[1] * this.fractionalStep1$ / this.fractionalStep2$;
  }

  public onSlideEnd(event: MouseEvent): void {
    this.value$ = [this.valueRange[0] * this.fractionalStep1$ / this.fractionalStep2$, this.valueRange[1] * this.fractionalStep1$ / this.fractionalStep2$];
    this.valueChange.emit(this.value$);
  }

  public onFromValueChange(newValue: number): void {
    this.fromValue = Math.floor(newValue * this.fractionalStep2$ / this.fractionalStep1$) * this.fractionalStep1$ / this.fractionalStep2$;
    this.value$ = [this.getRangeLimitedFromValue(this.fromValue), this.value$[1]];
    this.fromValue = this.value$[0];
    this.valueRange = [this.value$[0] * this.fractionalStep2$ / this.fractionalStep1$, this.value$[1] * this.fractionalStep2$ / this.fractionalStep1$];
    this.valueChange.emit(this.value$);
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  private getRangeLimitedFromValue(newFromValue: number): number {
    return newFromValue < this.min ? this.min : (newFromValue > this.toValue ? this.toValue : newFromValue );
  }

  public onToValueChange(newValue: number): void {
    this.toValue = Math.ceil(newValue * this.fractionalStep2$ / this.fractionalStep1$) * this.fractionalStep1$ / this.fractionalStep2$;
    this.value$ = [this.value$[0], this.getRangeLimitedToValue(this.toValue)];
    this.toValue = this.value$[1];
    this.valueRange = [this.value$[0] * this.fractionalStep2$ / this.fractionalStep1$, this.value$[1] * this.fractionalStep2$ / this.fractionalStep1$];
    this.valueChange.emit(this.value$);
    this.cd.markForCheck();
  }

  private getRangeLimitedToValue(newToValue: number): number {
    return newToValue > this.max ? this.max : (newToValue < this.fromValue ? this.fromValue : newToValue );
  }

  public toggleSort(): void {
    switch (this.sortOrder$) {
      case 'asc' :  this.sortOrder$ = 'desc';
                    break;
      case 'desc' : this.sortOrder$ = 'none';
                    break;
      case 'none' : this.sortOrder$ = 'asc';
    }
    this.sortOrderChange.emit(this.sortOrder$);
  }
}

@NgModule({
    imports: [CommonModule, FormsModule, InplaceModule, SliderModule],
    exports: [InputWithSliderHeaderComponent],
    declarations: [InputWithSliderHeaderComponent]
})
export class InputWithSliderHeaderModule { }
