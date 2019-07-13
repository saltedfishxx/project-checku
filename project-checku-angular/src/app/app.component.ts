import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'project-checku-angular';

  ngOnInit(): void {

    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    console.log('Window user agent: ' +  window.navigator.userAgent);
    console.log('is IE or edge: ' + isIEOrEdge);
    }
  
}
