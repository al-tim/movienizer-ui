import { IMovieFilterRanges } from './../domain/filterRanges';
import { IMovie, IMovieFilter, IPerson } from './../domain/movie';
import { IPage } from './../domain/page';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {
  private SERVER_ADDR: string = 'http://alexeytimkin.synology.me:7070';
  private SERVER_ADDR2 = 'http://localhost:8080';

  constructor(private http: Http) {}

  getPersons(fromIndex: number, toIndex: number, name: string): Observable<IPage<IPerson[]>> {
    return this.http.get(encodeURI(`${this.SERVER_ADDR}/movienizer-rest/movies/all/persons/in-collection/?fromIndex=${fromIndex}&toIndex=${toIndex}&name=${name}`))
            .map((response: Response) => { // onsuccess
                return response.json();
            });
  }

  getMovies(fromIndex: number, toIndex: number, movieFilters: IMovieFilter): Observable<IPage<IMovie[]>> {
    let queryString = '';
    for (let prop in movieFilters) {
      if (movieFilters[prop]) {
        queryString = queryString + '&' + prop + '=' + movieFilters[prop];
      }
    }
    return this.http.get(encodeURI(`${this.SERVER_ADDR}/movienizer-rest/movies/in-collection/?fromIndex=${fromIndex}&toIndex=${toIndex}` + queryString))
            .map((response: Response) => { // onsuccess
                return response.json();
            });
  }

  getMovieFilterRanges(): Observable<IMovieFilterRanges> {
    return this.http.get(`${this.SERVER_ADDR}/movienizer-rest/movies/in-collection/all/ranges`)
           .map((response: Response) => { // onsuccess
             return response.json();
           });
  }

  getAllMovies(): Observable<IMovie[]> {
    return this.http.get(`${this.SERVER_ADDR}/movienizer-rest/movies/in-collection/all`)
           .map((response: Response) => { // onsuccess
             return response.json();
           });
  }
}
