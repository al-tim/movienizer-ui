import { Utils } from './../common/utils';
import { ConfiguratonService } from './configuration-service';
import { IMovieFilterRanges } from './../domain/filterRanges';
import { IMovie, IMovieFilter, IPerson, IPersonFullSummary } from './../domain/movie';
import { IPage } from './../domain/page';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {

  constructor(private http: Http, private config: ConfiguratonService) {}

  getPersonsById(ids: number[]): Observable<IPersonFullSummary[]> {
    return this.http.get(`${this.config.SERVER_ADDR}/movienizer-rest/movies/all/persons?${ids.map(x => 'id=' + x.toString()).join('&')}`)
            .map((response: Response) => { // onsuccess
                return response.json();
            });
  }

  getMoviesById(ids: number[]): Observable<IMovie[]> {
    return this.http.get(`${this.config.SERVER_ADDR}/movienizer-rest/movies/in-collection/by-id?${ids.map(x => 'id=' + x.toString()).join('&')}`)
            .map((response: Response) => { // onsuccess
                return response.json();
            });
  }

  getPersons(fromIndex: number, toIndex: number, name: string): Observable<IPage<IPerson[]>> {
    return this.http.get(`${this.config.SERVER_ADDR}/movienizer-rest/movies/all/persons/in-collection/?fromIndex=${fromIndex}&toIndex=${toIndex}&name=${encodeURIComponent(name)}`)
            .map((response: Response) => { // onsuccess
                return response.json();
            });
  }

  getMovies4FilterQuery(filterQuery: string): Observable<IPage<IMovie[]>> {
    return this.http.get(`${this.config.SERVER_ADDR}/movienizer-rest/movies/in-collection/?${filterQuery}`)
            .map((response: Response) => { // onsuccess
                return response.json();
            });
  }

  getMovies(fromIndex: number, toIndex: number, movieFilters: IMovieFilter): Observable<IPage<IMovie[]>> {
    return this.http.get(`${this.config.SERVER_ADDR}/movienizer-rest/movies/in-collection/?fromIndex=${fromIndex}&toIndex=${toIndex}` + Utils.getQueryString(movieFilters))
            .map((response: Response) => { // onsuccess
                return response.json();
            });
  }

  getMovieFilterRanges(): Observable<IMovieFilterRanges> {
    return this.http.get(`${this.config.SERVER_ADDR}/movienizer-rest/movies/in-collection/all/ranges`)
           .map((response: Response) => { // onsuccess
             return response.json();
           });
  }

  getAllMovies(): Observable<IMovie[]> {
    return this.http.get(`${this.config.SERVER_ADDR}/movienizer-rest/movies/in-collection/all`)
           .map((response: Response) => { // onsuccess
             return response.json();
           });
  }
}
