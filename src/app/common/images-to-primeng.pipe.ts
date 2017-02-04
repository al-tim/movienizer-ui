import { IImage } from './../domain/movie';
import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagesToPrimeNg'
})
export class ImagesToPrimeNgPipe implements PipeTransform {

  public transform(images: IImage[], imageBaseUrl: string): {source: string, thumbnail: string, title: string}[] {
    return images.map((item: IImage) => { return {source: imageBaseUrl + item.path, thumbnail: imageBaseUrl + item.path, title: ''}; });
  }
}

@NgModule({
    imports: [],
    exports: [ImagesToPrimeNgPipe],
    declarations: [ImagesToPrimeNgPipe]
})
export class ImagesToPrimeNgPipeModule { }
