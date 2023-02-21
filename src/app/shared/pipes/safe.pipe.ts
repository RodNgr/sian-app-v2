import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(url: string, type: string = 'url') {
        switch (type) {
            case 'url': return this.sanitizer.bypassSecurityTrustResourceUrl(url);
            case 'html': return this.sanitizer.bypassSecurityTrustHtml(url);
            default: return url;
        }
        
    }

}
