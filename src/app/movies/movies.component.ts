import { Utils } from './../common/utils';
import { ConfiguratonService } from './../service/configuration-service';
import { MovieSummaryModule } from './../movie-summary/movie-summary.component';
import { InputWithSliderHeaderModule } from './../input-with-slider-header/input-with-slider-header.component';
import { HighlightPipeModule } from './../common/highlight.pipe';
import { ModalSpinnerModule } from './../modal-spinner/modal-spinner.component';
import { SearchInputModule } from './../search-input/search-input.component';
import { IMovieFilterRanges } from './../domain/filterRanges';
import { IMovie, IMovieFilter, IPerson, ISortSummary, SortOrder } from '../domain/movie';
import { MovieService } from '../service/movieservice';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnDestroy, OnInit, Renderer } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Message } from 'primeng/components/common/api';
import { LazyLoadEvent } from 'primeng/components/common/api';
import { AutoCompleteModule, ButtonModule, DataTableModule, FieldsetModule, GrowlModule, InputSwitchModule, InputTextModule,
         MessagesModule, MultiSelectModule, SelectItem, SliderModule, TooltipModule } from 'primeng/primeng';
import { Subject, Subscription } from 'rxjs/Rx';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesComponent implements AfterViewInit, OnInit, OnDestroy {
  public DEFAULT_MINYEAR: number = 0;
  public DEFAULT_MAXYEAR: number = new Date().getFullYear();
  public DEFAULT_MINDURATION: number = 0;
  public DEFAULT_MAXDURATION: number = 350;
  public DEFAULT_MINKINOPOISKRATING: number = 0;
  public DEFAULT_MAXKINOPOISKRATING: number = 10;
  public DEFAULT_MINIMDBRATING: number = 0;
  public DEFAULT_MAXIMDBRATING: number = 10;

  public initializationStatus: {
    initialized: boolean,
    filterRangesInitialized: boolean,
    paramsInitialized: boolean} = {
      get initialized(): boolean { return this.filterRangesInitialized && this.paramsInitialized; },
      filterRangesInitialized: false,
      paramsInitialized: false
    };

  public selectedMovie: IMovie;
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

  public durationRange: Array<number>;

  public kinopoiskRatingRange: Array<number>;
  public imdbRatingRange: Array<number>;

  public personIdsFromQueryParams: number[];
  public personsFiltered: IPerson[];
  public personsSelected: IPerson[];
  public personsMatchAll: boolean = false;

  public genresSelectedFromQueryParams: string[];
  public genresSelected: string[];
  public genresMatchAll: boolean = false;
  public genreSelectItems: SelectItem[];

  public countriesSelectedFromQueryParams: string[];
  public countriesSelected: string[];
  public countriesMatchAll: boolean = false;
  public countrySelectItems: SelectItem[];

  private movieLoadStream$: Subject<boolean>;
  private movieLoadStream$$: Subscription;
  private loadMoviesHTTPSubscription: Subscription;

  public globalSearchTokens: string[];
  public sortSummary: ISortSummary = {fieldName: '', sortOrder: 'none'};
  readonly sortValuesHolderInit: SortValuesHolder = {['Year']: 'none', ['Kinopoisk_Rating']: 'none', ['IMDB_Rating']: 'none', ['Duration']: 'none'};
  public sortValuesHolder: SortValuesHolder = Utils.copyObject(this.sortValuesHolderInit);

  public documentClickListener: Function;

  private initParams: Params;
  constructor(private movieService: MovieService, private config: ConfiguratonService, private cd: ChangeDetectorRef,
              private route: ActivatedRoute, private router: Router, private platformLocation: PlatformLocation, public renderer: Renderer) {
    route.queryParams.subscribe(// This handles initial initialization from query parameters
      (params) => {
        this.initParams = params;
        this.initFromParams(params);
      }
    ).unsubscribe();
    platformLocation.onPopState(// This handles going back and forth in the browser history
      () => {
        this.initFromParams(Utils.getQueryParams());
      }
    );
  }

  private initFromParams(params: Params): void {
    this.globalSearch = params['globalSearch'];
    this.titleSearch = params['title'];
    this.originalTitleSearch = params['originalTitle'];
    this.yearRange =
      (params['fromYear'] && params['toYear']) ?
        [params['fromYear'], params['toYear']] :
        (this.filterRanges ? [this.filterRanges.minYear, this.filterRanges.maxYear] : [this.DEFAULT_MINYEAR, this.DEFAULT_MAXYEAR]);
    this.durationRange =
      (params['fromDuration'] && params['toDuration']) ?
        [params['fromDuration'], params['toDuration']] :
        (this.filterRanges ? [this.filterRanges.minDuration, this.filterRanges.maxDuration] : [this.DEFAULT_MINDURATION, this.DEFAULT_MAXDURATION]);
    this.kinopoiskRatingRange =
      (params['fromKinopoisk'] && params['toKinopoisk']) ?
        [params['fromKinopoisk'], params['toKinopoisk']] :
        (this.filterRanges ? [this.filterRanges.minKinopoiskRating, this.filterRanges.maxKinopoiskRating] : [this.DEFAULT_MINKINOPOISKRATING, this.DEFAULT_MAXKINOPOISKRATING]);
    this.imdbRatingRange =
      (params['fromIMDB'] && params['toIMDB']) ?
        [params['fromIMDB'], params['toIMDB']] :
        (this.filterRanges ? [this.filterRanges.minIMDBRating, this.filterRanges.maxIMDBRating] : [this.DEFAULT_MINIMDBRATING, this.DEFAULT_MAXIMDBRATING]);
    if (params['personIds']) {
      this.initPersonsById(params['personIds'].split(',').map(x => parseInt(x, 10)));
    } else {
      this.personsSelected = [];
    }
    this.personsMatchAll = (params['personsMatchAll'] && params['personsMatchAll'] === 'true');
    this.genresSelectedFromQueryParams = params['genres'] ? (<string>params['genres']).split(',') : [];
    this.genresMatchAll = (params['genresMatchAll'] && params['genresMatchAll'] === 'true');
    this.countriesSelectedFromQueryParams = params['countries'] ? (<string>params['countries']).split(',') : [];
    this.countriesMatchAll = (params['countriesMatchAll'] && params['countriesMatchAll'] === 'true');
    this.sortSummary.fieldName = params['sortFieldName'];
    this.sortSummary.sortOrder = params['sortOrder'];
    if (this.filterRanges) {
      this.genresSelected = this.genresSelectedFromQueryParams;
      this.countriesSelected = this.countriesSelectedFromQueryParams;
    }
    this.initializationStatus.paramsInitialized = !params['personIds'];
    if (this.initializationStatus.initialized) { this.movieLoadStream$.next(false); }
  }

  private initPersonsById(ids: number[]): void {
    this.personIdsFromQueryParams = ids;
    this.movieService.getPersonsById(ids).subscribe(
      persons => { this.personsSelected = persons;
                   this.initializationStatus.paramsInitialized = true;
                   if (this.initializationStatus.initialized) { this.movieLoadStream$.next(false); }
                 },
      error => (this.msgs.push({severity: 'error', summary: 'Failed to fetch person info for <Directors/Writers/Actors> filter', detail: error})),
      () => this.rerender()
    );
  }

  public ngOnInit(): void {
    this.movieService.getMovieFilterRanges().subscribe(
      filterRanges => {this.filterRanges = filterRanges;
                       this.filterRanges.minKinopoiskRating = Math.floor(this.filterRanges.minKinopoiskRating * 10) / 10;
                       this.filterRanges.minIMDBRating = Math.floor(this.filterRanges.minIMDBRating * 10) / 10;
                       this.filterRanges.maxKinopoiskRating = Math.ceil(this.filterRanges.maxKinopoiskRating * 10) / 10;
                       this.filterRanges.maxIMDBRating = Math.ceil(this.filterRanges.maxIMDBRating * 10) / 10;
                       this.genreSelectItems = this.filterRanges.genres.map((x) => {return {label: x, value: x}; });
                       this.countrySelectItems = this.filterRanges.countries.map((x) => {return {label: x, value: x}; });
                       this.initFromParams(this.initParams);
                       this.initChangeableFilterProperties(false);
                       if (this.genresSelectedFromQueryParams) { this.genresSelected = this.genresSelectedFromQueryParams; };
                       if (this.countriesSelectedFromQueryParams) { this.countriesSelected = this.countriesSelectedFromQueryParams; };
                       this.initializationStatus.filterRangesInitialized = true;
      },
      error => (this.msgs.push({severity: 'error', summary: 'Failed to fetch movie filter ranges', detail: error}), this.loading = false),
      () => (this.loading = false, this.rerender())
    );
    this.movieLoadStream$ = new Subject<boolean>();
    this.movieLoadStream$$ = this.movieLoadStream$.debounceTime(250).subscribe(
      (updateRoute) => { this.loadMovies(updateRoute); },
      error => (this.msgs.push({severity: 'error', summary: 'Failed to fetch movies', detail: error})),
    );
  }

  ngAfterViewInit(): void {
    this.documentClickListener = this.renderer.listenGlobal('body', 'click', (event) => {
      this.rerender();
    });
  }

  private initChangeableFilterProperties(reset: boolean): void {
    if (reset || !this.yearRange) { this.yearRange = [this.filterRanges.minYear, this.filterRanges.maxYear]; }
    if (reset || !this.durationRange) { this.durationRange = [this.filterRanges.minDuration, this.filterRanges.maxDuration]; }
    if (reset || !this.kinopoiskRatingRange) { this.kinopoiskRatingRange = [this.filterRanges.minKinopoiskRating, this.filterRanges.maxKinopoiskRating]; }
    if (reset || !this.imdbRatingRange) { this.imdbRatingRange = [this.filterRanges.minIMDBRating, this.filterRanges.maxIMDBRating]; }

    if (reset) {
      this.resetPersons();
      this.resetGenres();
      this.resetCountries();
    }

    if (reset || !this.globalSearch) { this.globalSearch = ''; }
    if (reset || !this.titleSearch) { this.titleSearch = ''; }
    if (reset || !this.originalTitleSearch) { this.originalTitleSearch = ''; }

    if (reset) {
      this.sortSummary.fieldName = undefined;
      this.sortSummary.sortOrder = 'none';
    }
    this.sortValuesHolder = Utils.copyObject(this.sortValuesHolderInit);
    if (this.sortSummary.fieldName) { this.sortValuesHolder[this.sortSummary.fieldName] = this.sortSummary.sortOrder; }
  }

  private resetChangeableFilterProperties(): void {
    this.initChangeableFilterProperties(true);
    this.selectedMovie = undefined;
  }

  private resetPersons(): void {
    this.personsFiltered = [];
    this.personsSelected = [];
    this.personsMatchAll = false;
  }

  public actionResetPersons(): void {
    this.resetPersons();
    this.movieLoadStream$.next(true);
    this.rerender();
  }

  private resetGenres(): void {
    this.genresSelected = [];
    this.genresMatchAll = false;
  }

  public actionResetGenres(): void {
    this.resetGenres();
    this.movieLoadStream$.next(true);
    this.rerender();
  }

  private resetCountries(): void {
    this.countriesSelected = [];
    this.countriesMatchAll = false;
  }

  public actionResetCountries(): void {
    this.resetCountries();
    this.movieLoadStream$.next(true);
    this.rerender();
  }

  public actionReset(): void {
    this.resetChangeableFilterProperties();
    this.movieLoadStream$.next(true);
    this.rerender();
  }

  public ngOnDestroy(): void {
    if (this.movieLoadStream$$) { this.movieLoadStream$$.unsubscribe(); };
    if (this.loadMoviesHTTPSubscription) { this.loadMoviesHTTPSubscription.unsubscribe(); };
    if (this.documentClickListener) { this.documentClickListener(); }
  }

  public onYearFilterChanged(event: Array<number>): void {
    this.movieLoadStream$.next(true);
  }

  public onDurationFilterChanged(event: Event): void {
    this.movieLoadStream$.next(true);
  }

  public onKinopoiskFilterChanged(event: Event): void {
    this.movieLoadStream$.next(true);
  }

  public onIMDBFilterChanged(event: Event): void {
    this.movieLoadStream$.next(true);
  }

  private prepareFilterSummary(): IMovieFilter {
    let params: IMovieFilter = {};
    if (this.globalSearch) { params['globalSearch'] = this.globalSearch; }
    if (this.titleSearch) { params['title'] = this.titleSearch; }
    if (this.originalTitleSearch) { params['originalTitle'] = this.originalTitleSearch; }
    if (this.yearRange && (!this.filterRanges || (this.filterRanges && (this.yearRange[0] > this.filterRanges.minYear || this.yearRange[1] < this.filterRanges.maxYear)))) {
      params['fromYear'] = this.yearRange[0];
      params['toYear'] = this.yearRange[1];
    }
    if (this.durationRange && (!this.filterRanges || (this.filterRanges && (this.durationRange[0] > this.filterRanges.minDuration || this.durationRange[1] < this.filterRanges.maxDuration)))) {
      params['fromDuration'] = this.durationRange[0];
      params['toDuration'] = this.durationRange[1];
    }
    if (this.kinopoiskRatingRange && (!this.filterRanges || (this.filterRanges && (this.kinopoiskRatingRange[0] > this.filterRanges.minKinopoiskRating || this.kinopoiskRatingRange[1] < this.filterRanges.maxKinopoiskRating)))) {
      params['fromKinopoisk'] = this.kinopoiskRatingRange[0];
      params['toKinopoisk'] = this.kinopoiskRatingRange[1];
    }
    if (this.imdbRatingRange && (!this.filterRanges || (this.filterRanges && (this.imdbRatingRange[0] > this.filterRanges.minIMDBRating || this.imdbRatingRange[1] < this.filterRanges.maxIMDBRating)))) {
      params['fromIMDB'] = this.imdbRatingRange[0];
      params['toIMDB'] = this.imdbRatingRange[1];
    }

    if (this.personIdsFromQueryParams && this.personIdsFromQueryParams.length) { // handle initial load when full person info may not be avaiable yet
      params['personIds'] = this.personIdsFromQueryParams;
      this.personIdsFromQueryParams = undefined;
    } else if (this.personsSelected && this.personsSelected.length > 0) {
      params['personIds'] = this.personsSelected.map(x => x.id);
    }
    if (this.personsMatchAll) { params['personsMatchAll'] = this.personsMatchAll; }
    if (this.genresSelected && this.genresSelected.length > 0) { params['genres'] = this.genresSelected; }
    if (this.genresMatchAll) { params['genresMatchAll'] = this.genresMatchAll; }
    if (this.countriesSelected && this.countriesSelected.length > 0) { params['countries'] = this.countriesSelected; }
    if (this.countriesMatchAll) { params['countriesMatchAll'] = this.countriesMatchAll; }

    if (this.sortSummary.fieldName) {
      params['sortFieldName'] = this.sortSummary.fieldName;
      params['sortOrder'] = this.sortSummary.sortOrder;
    }

    return params;
  }

  // tslint:disable-next-line:member-ordering
  private previousGetMoviesFilterQuery: string = '';
  private loadMovies(updateRoute: boolean): void {
    let filter = this.prepareFilterSummary();
    let newGetMoviesFilterQuery: string = Utils.getQueryString(filter);
    newGetMoviesFilterQuery = `fromIndex=${this.fromIndex}&toIndex=${this.toIndex}` + (newGetMoviesFilterQuery ? '&' : '') + newGetMoviesFilterQuery;
    if (newGetMoviesFilterQuery !== this.previousGetMoviesFilterQuery) {
      this.loading = true;
      this.previousGetMoviesFilterQuery = newGetMoviesFilterQuery;
      if (updateRoute) { this.router.navigate(['movies'], { queryParams: filter }); }
      if (this.loadMoviesHTTPSubscription && !this.loadMoviesHTTPSubscription.closed) {
        this.loadMoviesHTTPSubscription.unsubscribe(); // Cancel previous not yet completed call
      }
      this.loadMoviesHTTPSubscription = this.movieService.getMovies4FilterQuery(newGetMoviesFilterQuery).subscribe(
        page => (this.totalMovieCount = (page) ? page.size : 0, this.movies = (page) ? page.data : undefined,
                this.fromIndex = (page) ? page.fromIndex : 0, this.toIndex = (page) ? page.toIndex : undefined,
                this.globalSearchTokens = (page) ? page.globalSearchTokens : [],
                this.loading = false, this.rerender()),
        error => (this.msgs.push({severity: 'error', summary: 'Failed to fetch movies', detail: error}), this.loading = false),
        () => (this.loading = false, this.rerender())
      );
      this.rerender();
    }
  }

  public loadMoviesLazy(event: LazyLoadEvent): void {
    this.fromIndex = event.first;
    this.toIndex = event.first + event.rows;
    this.movieLoadStream$.next(false);
  }

  public globalSearchInitiated(searchString: string): void {
    this.globalSearch = searchString;
    this.movieLoadStream$.next(true);
  }

  public titleSearchInitiated(searchString: string): void {
    this.titleSearch = searchString;
    this.movieLoadStream$.next(true);
  }

  public originalTitleSearchInitiated(searchString: string): void {
    this.originalTitleSearch = searchString;
    this.movieLoadStream$.next(true);
  }

  // tslint:disable-next-line:no-any
  public filterPersons(event: any): void {
    this.movieService.getPersons(0, 20, event.query).subscribe(
      page => (this.personsFiltered = (page) ? page.data : undefined),
      error => (this.msgs.push({severity: 'error', summary: 'Failed to fetch directors/writers/actors', detail: error}), this.loading = false),
      () => (this.rerender())
    );
  }

  // tslint:disable-next-line:no-any
  public onPersonSelected(event: any): void {
    this.movieLoadStream$.next(true);
  }

  // tslint:disable-next-line:no-any
  public onPersonsMatchAllToggled(event: any): void {
    if (this.personsSelected && this.personsSelected.length > 1) {
      this.movieLoadStream$.next(true);
    }
  }

  // tslint:disable-next-line:no-any
  public onGenreSelected(event: any): void {
    this.movieLoadStream$.next(true);
  }

  // tslint:disable-next-line:no-any
  public onGenresMatchAllToggled(event: any): void {
    if (this.genresSelected && this.genresSelected.length > 1) {
      this.movieLoadStream$.next(true);
    }
  }

  // tslint:disable-next-line:no-any
  public onCountrySelected(event: any): void {
    this.movieLoadStream$.next(true);
  }

  // tslint:disable-next-line:no-any
  public onCountriesMatchAllToggled(event: any): void {
    if (this.countriesSelected && this.countriesSelected.length > 1) {
      this.movieLoadStream$.next(true);
    }
  }

  public onMovieSelection(event: {data: IMovie}): void {
    console.log('onMovieSelection: %O', event);
//    this.router.navigate(['/', { outlets: { popupOverlay: ['movie', event.data.id]}}], { preserveQueryParams: true });
  }

  public onMovieLookup(movie: IMovie): void {
    console.log('onMovieLookup: %O', movie);
    this.router.navigate(['/', { outlets: { popupOverlay: ['movie', movie.id]}}], { preserveQueryParams: true });
  }

  public toggleSortOrder(event: SortOrder, fieldName: FieldNames): void {
    this.sortValuesHolder = Utils.copyObject(this.sortValuesHolderInit);
    this.sortValuesHolder[fieldName] = event;
    this.sortSummary.fieldName = fieldName;
    this.sortSummary.sortOrder = event;
    this.rerender();
    this.movieLoadStream$.next(true);
  }

  // tslint:disable-next-line:no-any
  public toggleSort(event: any, fieldName: FieldNames): void {
    if (this.sortSummary.fieldName === fieldName) {
      switch (this.sortSummary.sortOrder) {
        case 'asc' :  this.sortSummary.sortOrder = 'desc';
                      break;
        case 'desc' : this.sortSummary.sortOrder = 'none';
                      this.sortSummary.fieldName = undefined;
                      break;
      }
    } else {
      this.sortSummary.fieldName = fieldName;
      this.sortSummary.sortOrder = 'asc';
      this.sortValuesHolder = Utils.copyObject(this.sortValuesHolderInit);
    }
    this.rerender();
    this.movieLoadStream$.next(true);
  }

  public sortCSSClass(fieldName: FieldNames): string {
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

  private  rerender(): void {
    this.cd.detectChanges();
    this.cd.markForCheck();
  }
}

export type FieldNames = 'Title' | 'Original_Title' | 'Year' | 'Kinopoisk_Rating' | 'IMDB_Rating' | 'Duration';
export type SortValuesHolder = {[fieldName: string]: SortOrder};

@NgModule({
  declarations: [
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
    HighlightPipeModule,
    InputSwitchModule,
    InputTextModule,
    InputWithSliderHeaderModule,
    MessagesModule,
    ModalSpinnerModule,
    MovieSummaryModule,
    MultiSelectModule,
    RouterModule,
    SearchInputModule,
    SliderModule,
    TooltipModule
  ],
  providers: [MovieService],
  exports: [MoviesComponent]
})
export class MoviesModule { }
