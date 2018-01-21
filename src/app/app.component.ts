import { Component } from '@angular/core';

interface Nav {
  link: string,
  name: string,
  exact: boolean
}
@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  nav: Nav[] = [
    {
      link: '/',
      name: 'Home',
      exact: true
    },
    {
      link: '/bookmarks',
      name: 'Bookmarks',
      exact: true
    },
    {
      link: '/bookmarks/add-new',
      name: 'Quick add',
      exact: true
    }
  ];
}
