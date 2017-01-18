import { HighlightPipe } from './../common/highlight.pipe';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ModalSpinnerModule } from './../modal-spinner/modal-spinner.component';
import { SearchInputModule } from './../search-input/search-input.component';
import { HorisontalFieldsetModule } from './../horisontal-fieldset/horisontal-fieldset.component';
import { IMovieFilterRanges } from './../domain/filterRanges';
import { IMovie, IMovieFilter, IPerson, ISortSummary, SortOrder } from '../domain/movie';
import { MovieService } from '../service/movieservice';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { LazyLoadEvent } from 'primeng/components/common/api';
import { AutoCompleteModule, ButtonModule, DataTableModule, FieldsetModule, GrowlModule, InputSwitchModule, InputTextModule,
         MessagesModule, MultiSelectModule, SelectItem, SliderModule, TooltipModule } from 'primeng/primeng';
import { Subject, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesComponent implements OnInit, OnDestroy {
  public movies: IMovie[];
  public totalMovieCount: number;
  public msgs: Message[] = [];
  public globalSearch: string;
  public titleSearch: string;
  public originalTitleSearch: string;
  private fromIndex: number = 0;
  private toIndex: number = 10;
  public loading: boolean = false;
  public filterRanges: IMovieFilterRanges;

  public yearRange: Array<number>;
  public fromYear: number;
  public toYear: number;

  public durationRange$: string;
  public durationRange: Array<number>;

  public kinopoiskRatingRange$: string;
  public kinopoiskRatingRange: Array<number>;

  public imdbRatingRange$: string;
  public imdbRatingRange: Array<number>;

  public personsFiltered: IPerson[];
  public personsSelected: IPerson[];
  public personsMatchAll = false;

  public genresSelected: string[];
  public genresMatchAll = false;
  public genreSelectItems: SelectItem[];

  public countriesSelected: string[];
  public countriesMatchAll = false;
  public countrySelectItems: SelectItem[];

  private movieLoadStream$: Subject<MoviesComponent>;
  private movieLoadStream$$: Subscription;
  private loadMoviesHTTPSubscription: Subscription;

  public globalSearchTokens: string[];
  public sortSummary: ISortSummary = {fieldName: '', sortOrder: 'none'};

  constructor(private movieService: MovieService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.movieService.getMovieFilterRanges().subscribe(
      filterRanges => (this.filterRanges = filterRanges,
                       this.filterRanges.minKinopoiskRating = Math.floor(this.filterRanges.minKinopoiskRating * 10),
                       this.filterRanges.minIMDBRating = Math.floor(this.filterRanges.minIMDBRating * 10),
                       this.filterRanges.maxKinopoiskRating = Math.ceil(this.filterRanges.maxKinopoiskRating * 10),
                       this.filterRanges.maxIMDBRating = Math.ceil(this.filterRanges.maxIMDBRating * 10),
                       this.genreSelectItems = this.filterRanges.genres.map((x) => {return {label: x, value: x}; }),
                       this.countrySelectItems = this.filterRanges.countries.map((x) => {return {label: x, value: x}; }),
                       this.resetChangeableFilterProperties()
                      ),
      error => (this.msgs.push({severity: 'error', summary: 'Failed to fetch movie filter ranges', detail: <any>error}), this.loading = false),
      () => (this.loading = false, this.rerender())
    );
    this.movieLoadStream$ = new Subject<MoviesComponent>();
    this.movieLoadStream$$ = this.movieLoadStream$.debounceTime(250).subscribe(
      (dummy) => { this.loadMovies(); },
      error => (this.msgs.push({severity: 'error', summary: 'Failed to fetch movies', detail: <any>error})),
    );
  }

  private resetChangeableFilterProperties() {
    this.yearRange = [this.filterRanges.minYear, this.filterRanges.maxYear];
    this.fromYear = this.yearRange[0];
    this.toYear = this.yearRange[1];
    this.durationRange = [this.filterRanges.minDuration, this.filterRanges.maxDuration];
    this.durationRange$ = this.formatRange(this.durationRange, 0);
    this.kinopoiskRatingRange = [this.filterRanges.minKinopoiskRating, this.filterRanges.maxKinopoiskRating];
    this.kinopoiskRatingRange$ = this.formatRange(this.kinopoiskRatingRange);
    this.imdbRatingRange = [this.filterRanges.minIMDBRating, this.filterRanges.maxIMDBRating];
    this.imdbRatingRange$ = this.formatRange(this.imdbRatingRange);

    this.personsFiltered = [];
    this.personsSelected = [];
    this.personsMatchAll = false;

    this.genresSelected = [];
    this.genresMatchAll = false;

    this.countriesSelected = [];
    this.countriesMatchAll = false;

    this.globalSearch = '';
    this.titleSearch = '';
    this.originalTitleSearch = '';

    this.sortSummary.fieldName = null;
    this.sortSummary.sortOrder = 'none';
  }

  public actionReset() {
    this.resetChangeableFilterProperties();
    this.movieLoadStream$.next(this);
    this.rerender();
  }

  public ngOnDestroy() {
    if (this.movieLoadStream$$) { this.movieLoadStream$$.unsubscribe(); };
    if (this.loadMoviesHTTPSubscription) { this.loadMoviesHTTPSubscription.unsubscribe(); };
  }

  onYearFilterChange(event: any) {
    this.fromYear = event.values[0];
    this.toYear = event.values[1];
    this.rerender();
  }

  onYearFilterChanged(event: any) {
    this.movieLoadStream$.next(this);
  }

  onFromYearFilterChange(newValue) {
    this.yearRange = [newValue, this.yearRange[1]];
    this.movieLoadStream$.next(this);
  }

  onToYearFilterChange(newValue) {
    this.yearRange = [this.yearRange[0], newValue];
    this.movieLoadStream$.next(this);
  }

  onDurationFilterChange(event: any) {
    this.durationRange$ = this.formatRange(<Array<number>>event.values, 0);
    this.rerender();
  }

  onDurationFilterChanged(event: any) {
    this.movieLoadStream$.next(this);
  }

  onKinopoiskFilterChange(event: any) {
    this.kinopoiskRatingRange$ = this.formatRange(<Array<number>>event.values);
    this.rerender();
  }

  onKinopoiskFilterChanged(event: any) {
    this.movieLoadStream$.next(this);
  }

  onIMDBFilterChange(event: any) {
    this.imdbRatingRange$ = this.formatRange(<Array<number>>event.values);
    this.rerender();
  }

  onIMDBFilterChanged(event: any) {
    this.movieLoadStream$.next(this);
  }

  private loadMovies() {
    this.loading = true;
    let filter = new Filter(this.globalSearch, this.titleSearch, this.originalTitleSearch,
                            this.yearRange ? this.yearRange[0] : null, this.yearRange ? this.yearRange[1] : null,
                            this.durationRange ? this.durationRange[0] : null, this.durationRange ? this.durationRange[1] : null,
                            this.kinopoiskRatingRange ? this.kinopoiskRatingRange[0] / 10 : null,
                            this.kinopoiskRatingRange ? this.kinopoiskRatingRange[1] / 10 : null,
                            this.imdbRatingRange ? this.imdbRatingRange[0] / 10 : null, this.imdbRatingRange ? this.imdbRatingRange[1] / 10 : null,
                            (this.personsSelected) ? this.personsSelected.map(x => x.id) : [], this.personsMatchAll,
                            this.genresSelected, this.genresMatchAll, this.countriesSelected, this.countriesMatchAll,
                            this.sortSummary.fieldName, this.sortSummary.sortOrder);
    if (this.loadMoviesHTTPSubscription) {
      this.loadMoviesHTTPSubscription.unsubscribe();
    }
    this.loadMoviesHTTPSubscription = this.movieService.getMovies(this.fromIndex, this.toIndex, filter).subscribe(
      page => (this.totalMovieCount = (page) ? page.size : 0, this.movies = (page) ? page.data : null,
               this.fromIndex = (page) ? page.fromIndex : 0, this.toIndex = (page) ? page.toIndex : null,
               this.globalSearchTokens = (page) ? page.globalSearchTokens : [],
               this.loading = false, this.rerender()),
      error => (this.msgs.push({severity: 'error', summary: 'Failed to fetch movies', detail: <any>error}), this.loading = false),
      () => (this.loading = false, this.rerender())
    );
    this.rerender();
  }

  private formatRange(range: Array<number>, fractionDigits = 1): string {
    if (range) {
      let newArray = new Array<string>();
      for (let i = 0; i < (<Array<number>>range).length; i++) {
        newArray.push((Math.round(range[i]) / Math.pow(10, fractionDigits)).toFixed(fractionDigits));
      }
      return newArray.join(' - ');
    } else {
      return null;
    }
  }

  loadMoviesLazy(event: LazyLoadEvent) {
    this.fromIndex = event.first;
    this.toIndex = event.first + event.rows;
    this.movieLoadStream$.next(this);
  }

  globalSearchInitiated(searchString: string) {
    this.globalSearch = searchString;
    this.movieLoadStream$.next(this);
  }

  titleSearchInitiated(searchString: string) {
    this.titleSearch = searchString;
    this.movieLoadStream$.next(this);
  }

  originalTitleSearchInitiated(searchString: string) {
    this.originalTitleSearch = searchString;
    this.movieLoadStream$.next(this);
  }

  filterPersons(event) {
    this.movieService.getPersons(0, 20, event.query).subscribe(
      page => (this.personsFiltered = (page) ? page.data : null),
      error => (this.msgs.push({severity: 'error', summary: 'Failed to fetch directors/writers/actors', detail: <any>error}), this.loading = false),
      () => (this.rerender())
    );
  }

  onPersonSelected(event) {
    this.movieLoadStream$.next(this);
  }

  onPersonsMatchAllToggled(event) {
    if (this.personsSelected && this.personsSelected.length > 1) {
      this.movieLoadStream$.next(this);
    }
  }

  onGenreSelected(event) {
    this.movieLoadStream$.next(this);
  }

  onGenresMatchAllToggled(event) {
    if (this.genresSelected && this.genresSelected.length > 1) {
      this.movieLoadStream$.next(this);
    }
  }

  onCountrySelected(event) {
    this.movieLoadStream$.next(this);
  }

  onCountriesMatchAllToggled(event) {
    if (this.countriesSelected && this.countriesSelected.length > 1) {
      this.movieLoadStream$.next(this);
    }
  }

  toggleSort(event, fieldName: FieldNames) {
    if (this.sortSummary.fieldName === fieldName) {
      switch (this.sortSummary.sortOrder) {
        case 'asc' :  this.sortSummary.sortOrder = 'desc';
                      break;
        case 'desc' : this.sortSummary.sortOrder = 'none';
                      this.sortSummary.fieldName = null;
                      break;
      }
    } else {
      this.sortSummary.fieldName = fieldName;
      this.sortSummary.sortOrder = 'asc';
    }
    console.log('sortSummary: %O', this.sortSummary);
    this.rerender();
    this.movieLoadStream$.next(this);
  }

  sortCSSClass(fieldName: FieldNames): string {
    if (this.sortSummary.fieldName === fieldName) {
      switch (this.sortSummary.sortOrder) {
        case 'asc': return 'fa-sort-asc';
        case 'desc': return 'fa-sort-desc';
        default : return '';
      }
    } else {
      return 'fa-sort';
    }
  }

  public rerender() {
    this.cd.detectChanges();
    this.cd.markForCheck();
  }
}

export type FieldNames = 'Title' | 'Original_Title' | 'Year' | 'Kinopoisk_Rating' | 'IMDB_Rating' | 'Duration';

export class Filter implements IMovieFilter {
  constructor(public globalSearch: string, public title: string, public originalTitle: string,
    public fromYear: number, public toYear: number, public fromDuration: number, public toDuration: number,
    public fromKinopoisk: number, public toKinopoisk: number, public fromIMDB: number, public toIMDB: number,
    public personIds: number[], public personsMatchAll: boolean, public genres: string[], public genresMatchAll: boolean,
    public countries: string[], public countriesMatchAll: boolean, public sortFieldName: string, public sortOrder: SortOrder) {}
}

@NgModule({
  declarations: [
    HighlightPipe,
    MoviesComponent
  ],
  imports: [
    AutoCompleteModule,
    BrowserModule,
    ButtonModule,
    FormsModule,
    DataTableModule,
    FieldsetModule,
    GrowlModule,
    HorisontalFieldsetModule,
    InputSwitchModule,
    InputTextModule,
    MessagesModule,
    ModalSpinnerModule,
    MultiSelectModule,
    SearchInputModule,
    SliderModule,
    TooltipModule
  ],
  providers: [MovieService],
  exports: [MoviesComponent]
})
export class MoviesModule { }
