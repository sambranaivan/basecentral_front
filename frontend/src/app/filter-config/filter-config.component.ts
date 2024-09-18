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

        // Load saved configurations from localStorage
        this.loadConfig();
    });
  }

  onFieldsChange(): void {
    this.emitConfig();
    this.saveConfig();
  }

  onPageSizeChange(): void {
    this.emitConfig();
    this.saveConfig();
  }
  private emitConfig(): void {
    this.configChanged.emit({
      campos: this.selectedFields,
      page_size: this.pageSize
    });
  }

  private saveConfig(): void {
    const config = {
      campos: this.selectedFields,
      page_size: this.pageSize
    };
    localStorage.setItem(`filterConfig_${this.entidad}`, JSON.stringify(config));
  }

  private loadConfig(): void {
    const savedConfig = localStorage.getItem(`filterConfig_${this.entidad}`);
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      this.selectedFields = config.campos || [];
      this.pageSize = config.page_size || 10;
      this.emitConfig();
    } else {
      // Set default values or emit empty configuration
      this.emitConfig();
    }
  }

  resetConfig(): void {
    this.selectedFields = [];
    this.pageSize = 10;
    this.emitConfig();
    localStorage.removeItem(`filterConfig_${this.entidad}`);
  }

  

  
}
