import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgModule, OnDestroy, Renderer } from '@angular/core';
import { DomHandler } from 'primeng/components/dom/domhandler';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  providers: [DomHandler]
})
export class LightboxComponent implements OnDestroy, AfterViewInit {
  @Input() images: ILightboxImage[];
  @Input() style: CSSStyleDeclaration;
  @Input() styleClass: string;
  public visible: boolean;
  public panel: HTMLElement;
  public index: number;
  public mask: HTMLElement;
  public prevButton: HTMLElement;
  public nextButton: HTMLElement;
  public preventDocumentClickListener: boolean;
  public documentClickListener: Function;

  constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {}

  onImageClick(event: Event, image: ILightboxImage, i: number): void {
    this.index = i;
    this.show();
    this.displayImage(image);

    this.preventDocumentClickListener = true;
    event.preventDefault();
  }

  ngAfterViewInit(): void {
    this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
      if (!this.preventDocumentClickListener && this.visible) {
        this.hide(event);
      }
      this.preventDocumentClickListener = false;
    });
  }

  displayImage(image: ILightboxImage): void {
    let imageElement: HTMLImageElement = <HTMLImageElement>this.domHandler.findSingle(this.panel, 'img');
    imageElement.src = encodeURI(image.source);
  }

  show(): void {
    this.mask = this.domHandler.findSingle(this.el.nativeElement, '.lightboxOverlayMask');
    this.mask = <HTMLElement>this.mask.cloneNode(true);
    this.mask.style.zIndex = (++DomHandler.zindex).toString();
    this.mask.style.display = 'block';
    this.mask.addEventListener('click', this.hide);
    document.body.appendChild(this.mask);

    this.panel = this.domHandler.findSingle(this.el.nativeElement, '.lightboxModalPanel');
    this.panel = <HTMLElement>this.panel.cloneNode(true);
    this.panel.style.zIndex = (++DomHandler.zindex).toString();
    this.panel.style.display = 'block';
    document.body.appendChild(this.panel);
    this.prevButton = this.domHandler.findSingle(this.panel, '.lightBoxImageLeftHalf');
    this.prevButton.addEventListener('click', this.prev.bind(this));
    this.nextButton = this.domHandler.findSingle(this.panel, '.lightBoxImageRightHalf');
    this.nextButton.addEventListener('click', this.next.bind(this));
    this.updateButtonStates();

    this.visible = true;
  }

  hide(event: Event): void {
    this.index = undefined;
    this.visible = false;

    if (this.panel) {
        document.body.removeChild(this.panel);
        this.panel = undefined;
    }
    if (this.mask) {
        document.body.removeChild(this.mask);
        this.mask = undefined;
    }

    if (event) { event.preventDefault(); }
  }

  updateButtonStates(): void {
    if (this.index === 0) {
      this.prevButton.style.display = 'none';
    } else {
      this.prevButton.style.display = 'block';
    }
    if (this.index === this.images.length - 1) {
      this.nextButton.style.display = 'none';
    } else {
      this.nextButton.style.display = 'block';
    }
  }

  prev(event: Event): void {
    if (this.index > 0) {
      this.displayImage(this.images[--this.index]);
      this.updateButtonStates();
    }
    if (event) { event.stopPropagation(); }
  }

  next(event: Event): void {
    if (this.index < this.images.length) {
      this.displayImage(this.images[++this.index]);
      this.updateButtonStates();
    }
    if (event) { event.stopPropagation(); }
  }

  ngOnDestroy(): void {
    this.hide(undefined);
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }
}

export interface ILightboxImage {
  source: string;
  thumbnail: string;
  title: string;
  alt: string;
}

@NgModule({
    imports: [ CommonModule ],
    exports: [ LightboxComponent ],
    declarations: [ LightboxComponent ]
})
export class LightboxModule { }
