import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.css']
})
export class DateRangeFilterComponent {
  @Input() field: string = '';
  @Input() filters: any;
}
