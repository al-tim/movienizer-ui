import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/primeng';

@Component({
  selector: 'app-inplace-input',
  template: `
        <span [ngClass]="'inplace'" [ngStyle]="style" [class]="styleClass">
            <span *ngIf="!active" (click)="activate($event)" (mouseover)="activate($event)">
                {{value}}
            </span>
            <input *ngIf="active" pInputText [ngClass]="'inline-edit'" [ngStyle]="inputStyle" [class]="inputStyleClass"
                   type="number" size="{{size}}" [placeholder]="placeholder" [(ngModel)]="value"
                   (ngModelChange)="actionChange($event)" min="{{min}}" max="{{max}}" step="{{step}}"
                   (blur)="deactivate($event)" (mouseout)="inputMouseOut($event)">
        </span>
    `,
  styleUrls: ['./inplace.component.css']
})
export class InplaceInputComponent {
  @Input() value: number;
  @Input() size: number = 4;
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() placeholder: string = '';
  @Input() active: boolean = false;
  // tslint:disable-next-line:no-any
  @Input() style: any;
  @Input() styleClass: string;
  // tslint:disable-next-line:no-any
  @Input() inputStyle: any;
  @Input() inputStyleClass: string;
  // tslint:disable-next-line:no-any
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-any
  @Output() onActivate: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-any
  @Output() onDeactivate: EventEmitter<any> = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) { }

  // tslint:disable-next-line:no-any
  public actionChange(event: any): void {
    this.onChange.emit(event);
    this.valueChange.emit(event);
  }

  // tslint:disable-next-line:no-any
  public activate(event: any): void {
    this.active = true;
    this.onActivate.emit(event);
    this.rerender();
  }

  // tslint:disable-next-line:no-any
  public deactivate(event: any): void {
    this.active = false;
    this.onDeactivate.emit(event);
    this.rerender();
  }

  // tslint:disable-next-line:no-any
  public inputMouseOut(event: any): void {
    if (event.target !== document.activeElement) {
      this.active = false;
      this.rerender();
    }
  }

  private  rerender(): void {
    this.cd.detectChanges();
    this.cd.markForCheck();
  }
}

@NgModule({
    imports: [CommonModule, FormsModule, InputTextModule],
    exports: [InplaceInputComponent],
    declarations: [InplaceInputComponent]
})
export class InplaceModule { }
