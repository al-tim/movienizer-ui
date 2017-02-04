import { ModalSpinnerModule } from './../modal-spinner/modal-spinner.component';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { Component, OnInit, NgModule, Input } from '@angular/core';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-overlay-dialog',
  templateUrl: './overlay-dialog.component.html',
  styleUrls: ['./overlay-dialog.component.css']
})
export class OverlayDialogComponent implements OnInit {
  @Input() header: string;
  @Input() loading: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  public actionOnClose(event: Event): void {
    // tslint:disable-next-line:no-null-keyword
    this.router.navigate(['/', { outlets: { popupOverlay: null}}], { preserveQueryParams: true });
  }
}

@NgModule({
    imports: [ ButtonModule, CommonModule, ModalSpinnerModule, RouterModule ],
    exports: [ OverlayDialogComponent ],
    declarations: [ OverlayDialogComponent ]
})
export class OverlayDialogModule { }
