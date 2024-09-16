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

  constructor(private legajoService: LegajoService) {}

  ngOnInit(): void {}

  search(): void {
    this.legajoService.searchLegajos(this.filters).subscribe(data => {
      this.legajos = data.results;
    });
  }
}
