import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LegajoService } from '../legajo.service';

@Component({
  selector: 'app-filter-config',
  templateUrl: './filter-config.component.html',
  styleUrls: ['./filter-config.component.css']
})
export class FilterConfigComponent implements OnInit {
  @Input() entidad: string = 'legajo';
  @Output() configChanged = new EventEmitter<{ campos: string[], page_size: number }>();

  entidadDefinition: any;
  availableFields: string[] = [];
  selectedFields: string[] = ['clave', 'estado']; // Default fields


  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageSize: number = 10;

  constructor(private legajoService: LegajoService) { }

  ngOnInit(): void {
    // Fetch the entity definition to get the possible fields
    this.legajoService.getEntidadDefinition(this.entidad).subscribe(definition => {
      this.entidadDefinition = definition;
      this.availableFields = Object.keys(this.entidadDefinition);
    });
  }

  onFieldsChange(): void {
    this.emitConfig();
  }

  onPageSizeChange(): void {
    this.emitConfig();
  }

  private emitConfig(): void {
    this.configChanged.emit({
      campos: this.selectedFields,
      page_size: this.pageSize
    });
  }
}
