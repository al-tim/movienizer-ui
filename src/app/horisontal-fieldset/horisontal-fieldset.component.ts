import { NgModule, Component, Input, trigger, state, transition, style, animate, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horisontal-fieldset',
  templateUrl: './horisontal-fieldset.component.html',
  styleUrls: ['./horisontal-fieldset.component.css'],
  animations: [
    trigger('fieldsetContent', [
      state('hidden', style({
        height: '0px'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class HorisontalFieldsetComponent /*implements BlockableUI*/ {
  @Input() legend: string;
  @Input() toggleable: boolean;
  @Input() collapsed: boolean = false;
  @Input() style: string;
  @Input() styleClass: string;

  public animating: boolean;

  constructor(private el: ElementRef) {}

  public toggle(): void {
    if (this.toggleable) {
      this.animating = true;
      this.collapsed = !this.collapsed;
      setTimeout(() => {
          this.animating = false;
      }, 400);
    }
  }
}

@NgModule({
    imports: [CommonModule],
    exports: [HorisontalFieldsetComponent],
    declarations: [HorisontalFieldsetComponent]
})
export class HorisontalFieldsetModule { }
