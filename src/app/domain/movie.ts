export interface IImage {
  path: string;
  sortOrder: number;
}

export interface IMovie {
  id: number;
  title: string;
  original_Title: string;
  year: number;
  description: string;
  duration: number;
  budget: string;
  awards: string;
  kinopoisk_Rating: number;
  site: string;
  imdb_Rating: number;
  directors: Array<IPerson>;
  writers: Array<IPerson>;
  actors: Array<IPerson>;
  imageFrontCovers: IImage[];
  imageScreenshots: IImage[];
  imagePosters: IImage[];
  imageBackdrops: IImage[];
}

export interface IMovieFilter {
  globalSearch?: string;
  title?: string;
  originalTitle?: string;
  fromYear?: number;
  toYear?: number;
  fromDuration?: number;
  toDuration?: number;
  fromKinopoisk?: number;
  toKinopoisk?: number;
  fromIMDB?: number;
  toIMDB?: number;
  personIds?: number[];
  personsMatchAll?: boolean;
  genres?: string[];
  genresMatchAll?: boolean;
  countries?: string[];
  countriesMatchAll?: boolean;
  sortFieldName?: string;
  sortOrder?: SortOrder;
}

export interface IPerson {
  id: number;
  name: string;
  original_Name: string;
  birth_Date: string;
  birthplace: string;
  height: number;
  biography: string;
  awards: string;
  site: string;
  photos: IImage[];
}

export interface IMovie4PersonFullSummary {
  title: string;
  original_Title: string;
  year: number;
  image: IImage;
}

export interface IPersonFullSummary extends IPerson {
  directorFor: IMovie4PersonFullSummary[];
  writerFor: IMovie4PersonFullSummary[];
  actorFor: IMovie4PersonFullSummary[];
}

export interface ISortSummary {
  fieldName: string | undefined;
  sortOrder: SortOrder;
}

export type SortOrder = 'asc' | 'desc' | 'none';
