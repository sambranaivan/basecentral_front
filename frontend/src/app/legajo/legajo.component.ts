import { Component, OnInit } from '@angular/core';
import { LegajoService } from '../legajo.service';

@Component({
  selector: 'app-legajo',
  templateUrl: './legajo.component.html',
  styleUrls: ['./legajo.component.css']
})
export class LegajoComponent implements OnInit {
  filters: any = {};
  legajos: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  page_size:number = 10;

  constructor(private legajoService: LegajoService) {}

  ngOnInit(): void {}

  search(page: number = 1): void {
    this.legajoService.searchLegajos(this.filters, page).subscribe(data => {
      this.legajos = data.results;
      this.totalPages = Math.ceil(data.count / this.page_size); // Suponiendo PAGE_SIZE = 10
      this.currentPage = page;
    });
  }
}
