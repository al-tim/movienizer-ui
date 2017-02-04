import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  public transform(text: string, searchTokens: string[]): string {
    if (searchTokens) {
      for (let i = 0; i < searchTokens.length; i++) {
        if (searchTokens[i]) {
          let regex = new RegExp(`(?:[^a-zA-Zа-яА-ЯёЁ]|^)(${searchTokens[i]}[a-zA-Zа-яА-ЯёЁ]{0,4})(?:[^a-zA-Zа-яА-ЯёЁ]|$)`, 'gi');
          text = text.replace(regex, (match: string, group: string) => match.replace(group, `<span class="highlight">${group}</span>`) );
        }
      }
    }
    return text;
  }
}

@NgModule({
    imports: [],
    exports: [HighlightPipe],
    declarations: [HighlightPipe]
})
export class HighlightPipeModule { }
