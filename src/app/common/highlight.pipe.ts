import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(text: string, searchTokens: string[]): string {
    for (let i = 0; i < searchTokens.length; i++) {
      if (searchTokens[i]) {
        let pattern = searchTokens[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        pattern = pattern.split(' ').filter((t) => {
          return t.length > 0;
        }).join('|');
        let regex = new RegExp(pattern, 'gi');
        text = text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
      }
    }
    return text;
  }
}
