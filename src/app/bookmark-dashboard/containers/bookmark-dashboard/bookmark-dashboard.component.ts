import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RoutesRecognized } from '@angular/router';

import 'rxjs/add/operator/filter';

import { BookmarkDashboardService } from '../../bookmark-dashboard.service';

import { Bookmark } from '../../models/bookmark.interface';

@Component({
  selector: 'bookmark-dashboard',
  styleUrls: ['bookmark-dashboard.component.scss'],
  template: `
    <div class="centered">
      <div class="bookmark-count">
        <bookmark-count
          [items]="bookmarks">
        </bookmark-count>
        <div>
          <button (click)="goToAdd()">+ Quick add</button>
        </div>
        <bookmark-card *ngFor="let bookmark of bookmarks;" [card]="bookmark">
        </bookmark-card>
      </div>
      <div class="bookmark-manager">
      <h2>Favorites</h2>
      <bookmark-detail
        *ngFor="let bookmark of favourites;"
        [detail]="bookmark"
        (edit)="handleEdit($event)"
        (removeFromFavourites)="handleRemoveFromFavourites($event)"
        (visit)="handleVisit($event)">
      </bookmark-detail>
      <p *ngIf="!favourites?.length">
        Don't forget to favorite the ones you like.
      </p>
      </div>
    </div>
  `
})
export class BookmarkDashboardComponent implements OnInit {
  bookmarks: Bookmark[];
  favourites: Bookmark[];

  constructor(
    private bookmarkService: BookmarkDashboardService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.router.events
      .filter((event) => (event instanceof NavigationEnd || event instanceof RoutesRecognized))
      .subscribe((event) => {
        this.bookmarkService
          .getBookmarks()
          .subscribe((data: Bookmark[]) => {
            this.bookmarks = data;
            this.favourites = data.filter(bookmark => bookmark.favourite);
          });
      });

    this.bookmarkService
      .getBookmarks()
      .subscribe((data: Bookmark[]) => {
        this.bookmarks = data;
        this.favourites = data.filter(bookmark => bookmark.favourite);
      });
  }

  handleEdit(event: Bookmark) {
    this.bookmarkService
      .updateBookmark(event)
      .subscribe((data: Bookmark) => {
        this.bookmarks = this.bookmarks.map((bookmark: Bookmark) => {
          if (bookmark.id === event.id) {
            bookmark = Object.assign({}, bookmark, event);
          }
          return bookmark;
        });
      });
  }

  handleRemoveFromFavourites(event: Bookmark) {
    this.bookmarkService
      .updateBookmark(event)
      .subscribe((data: Bookmark) => {
        this.favourites = this.favourites.filter((bookmark: Bookmark) => {
          if (bookmark.id === event.id) {
            bookmark = Object.assign({}, bookmark, event);
          }
          this.favourites = this.favourites.filter((favourite: Bookmark) => {
            return favourite.id !== event.id;
          });
        });
      });
  }

  // handleRemove(event: Bookmark) {
  //   this.bookmarkService
  //     .removeBookmark(event)
  //     .subscribe((data: Bookmark) => {
  //       this.bookmarks = this.bookmarks.filter((bookmark: Bookmark) => {
  //         return bookmark.id !== event.id;
  //       });
  //     });
  // }

  handleVisit(event: Bookmark) {
    this.router.navigateByUrl(event.url);
  }

  goToAdd() {
    this.router.navigate(['bookmarks', 'add-new']);
  }


}
