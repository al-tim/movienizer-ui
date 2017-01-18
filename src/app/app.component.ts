import { IPage } from './domain/page';
import { IMovie } from './domain/movie';
import { MovieService } from './service/movieservice';
import { Component, OnInit, Directive } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import {LazyLoadEvent} from 'primeng/components/common/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {
  }
}
