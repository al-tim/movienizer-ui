export class IMovieFilterRanges {
  minYear: number;
  maxYear: number;
  minDuration: number;
  maxDuration: number;
  minKinopoiskRating: number;
  maxKinopoiskRating: number;
  minIMDBRating: number;
  maxIMDBRating: number;
  genres: Array<string>;
  countries: Array<string>;
  studios: Array<string>;
}
