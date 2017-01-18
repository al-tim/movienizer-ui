export interface IPage<T> {
  size: number;
  data: T;
  fromIndex: number;
  toIndex: number;
  globalSearchTokens?: string[];
}
