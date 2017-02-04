import { Message } from 'primeng/components/common/api';
import { GrowlModule } from 'primeng/primeng';
import { PersonSummaryModule } from './../person-summary/person-summary.component';
import { MovieService } from './../service/movieservice';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OverlayDialogModule } from './../overlay-dialog/overlay-dialog.component';
import { CommonModule } from '@angular/common';
import { IPersonFullSummary } from './../domain/movie';
import { Component, OnInit, NgModule, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-person-overlay',
  templateUrl: './person-overlay.component.html'
})
export class PersonOverlayComponent implements OnInit {
  private person: IPersonFullSummary;
  public msgs: Message[] = [];
  private loading: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private cd: ChangeDetectorRef, private movieService: MovieService) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.switchMap((params: Params) => this.movieService.getPersonsById([+params['id']])).subscribe(
      (persons: IPersonFullSummary[]) => {
        if (persons && persons.length > 0) { this.person = persons[0]; }
        this.loading = false;
        this.cd.markForCheck();
      },
      error => this.msgs.push({severity: 'error', summary: 'Failed to fetch person', detail: error}),
      () => (this.loading = false)
    );
  }
}

@NgModule({
    imports: [ CommonModule, GrowlModule, OverlayDialogModule, PersonSummaryModule ],
    exports: [ PersonOverlayComponent ],
    declarations: [ PersonOverlayComponent ]
})
export class PersonOverlayModule { }
