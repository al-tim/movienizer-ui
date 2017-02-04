import { NgModule } from '@angular/core';

export class Utils {

  // tslint:disable-next-line:no-any
  public static copyObject(object: {[prop: string]: any}): {[prop: string]: any} {
    // tslint:disable-next-line:no-any
    let newObject:  {[prop: string]: any} = {};
    for (let prop in object) {
      if (object.hasOwnProperty(prop)) {
        newObject[prop] = object[prop];
      }
    }
    return newObject;
  }

  public static getQueryParams(): {[prop: string]: string} {
    let queryParams: {[prop: string]: string} = {};
    let queryParamStrings: string[] = window.location.search.substring(1).split('&');
    for (let i = 0, l = queryParamStrings.length; i < l; i++) {
      let splitParam = queryParamStrings[i].split('=');
      queryParams[splitParam[0]] = decodeURIComponent(splitParam[1]);
    }
    return queryParams;
  }

  // tslint:disable-next-line:no-any
  public static getQueryString(queryParams: {[prop: string]: any}): string {
    let queryString = '';
    for (let prop in queryParams) {
      if (queryParams.hasOwnProperty(prop) && queryParams[prop]) {
        queryString = queryString + '&' + prop + '=' + encodeURIComponent(queryParams[prop]);
      }
    }
    return queryString;
  }

  private constructor() {}
}
