import { BrowserModule } from '@angular/platform-browser';
import {
    AfterContentInit,
    AfterViewChecked,
    Component,
    ContentChild,
    ElementRef,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-modal-spinner',
  templateUrl: './modal-spinner.component.html',
  styleUrls: ['./modal-spinner.component.css']
})
export class ModalSpinnerComponent implements AfterViewChecked, AfterContentInit {
    @Input() loading: boolean;
    @Input() selector?: string;
    @ViewChild('content') contentEl;
    @ViewChild('spinner') spinnerEl;
    @ContentChild('spinnerTemplate') spinnerTemplate;
    @ViewChild('target', { read: ViewContainerRef }) target: ViewContainerRef;
    public defaultTemplate: boolean;

    constructor(private el: ElementRef, private viewContainerRef: ViewContainerRef) {}

    public ngAfterContentInit(): void {
        this.defaultTemplate = !this.spinnerTemplate;
        if (this.spinnerTemplate) {
            this.target.createEmbeddedView(this.spinnerTemplate);
        }
    }

    private getZIndex (e: Element): number {
        const z = parseInt(window.document.defaultView.getComputedStyle(e).getPropertyValue('z-index'), 10);
        if (isNaN(z)) {
            return 0;
        }
        return z;
    }

    public ngAfterViewChecked(): void {
        let elementToFollow;
        if (this.selector) {
            elementToFollow = this.contentEl.nativeElement.querySelector(this.selector);
        } else {
            elementToFollow = this.contentEl.nativeElement;
        }
        const zIndex = this.getZIndex(elementToFollow);

        const targetRect = elementToFollow.getBoundingClientRect();
        const elRect = this.el.nativeElement.getBoundingClientRect();


        const s = this.spinnerEl.nativeElement;
        s.style.zIndex = this.loading ? zIndex + 1 : -1000;
        s.style.left = `${targetRect.left - elRect.left}px`;
        s.style.top = `${targetRect.top - elRect.top}px`;
        s.style.width = `${elementToFollow.clientWidth}px`;
        s.style.height = `${elementToFollow.clientHeight}px`;
    }
}

@NgModule({
  declarations: [
    ModalSpinnerComponent,
  ],
  imports: [
    BrowserModule
  ],
  exports: [ModalSpinnerComponent]
})
export class ModalSpinnerModule { }
