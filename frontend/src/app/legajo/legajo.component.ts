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
  entidadDefinition: any;
  entidad = 'Legajo';
  isLoading: boolean = false;
  displayedColumns: string[] = ['clave', 'estado', 'fecha_alta_date','caratula', 'acciones'];

  availableFields: string[] = [];
  selectedFilters: { field: string, type: string }[] = [];
  remainingFields: string[] = [];

  constructor(private legajoService: LegajoService) {}

  ngOnInit(): void {
    this.legajoService.getEntidadDefinition(this.entidad).subscribe(definition => {
      this.entidadDefinition = definition;
      this.availableFields = Object.keys(this.entidadDefinition);
      this.remainingFields = [...this.availableFields];
    });
  }

  addFilter(): void {
    if (this.remainingFields.length > 0) {
      const field = '';
      const type = '';
      this.selectedFilters.push({ field, type });
    }
  }

  onFieldSelected(filterIndex: number): void {
    const field = this.selectedFilters[filterIndex].field;
    const type = this.entidadDefinition[field];
    this.selectedFilters[filterIndex].type = type;

    this.remainingFields = this.remainingFields.filter(f => f !== field);

    // Inicializar valores de filtros
    if (type === 'DateTimeField' || field.includes('fecha')) {
      this.filters[field + '_from'] = null;
      this.filters[field + '_to'] = null;
    } else {
      this.filters[field] = null;
    }
  }

  removeFilter(index: number): void {
    const field = this.selectedFilters[index].field;

    if (field) {
      this.remainingFields.push(field);
    }
    this.selectedFilters.splice(index, 1);
  }

  search(page: number = 1): void {
    this.currentPage = page;
    this.isLoading = true; // Iniciar el indicador de carga
    
    const processedFilters: any = {};
  
    this.selectedFilters.forEach(filter => {
      const field = filter.field;
      const type = filter.type;
  
      if (type === 'DateTimeField' || field.includes('fecha')) {
        const fromValue = this.filters[field + '_from'];
        const toValue = this.filters[field + '_to'];
  
        if (fromValue) {
          const dateFrom = new Date(fromValue);
          processedFilters[field + '_from'] = dateFrom.toISOString().split('T')[0];
        }
        if (toValue) {
          const dateTo = new Date(toValue);
          processedFilters[field + '_to'] = dateTo.toISOString().split('T')[0];
        }
      } else {
        const value = this.filters[field];
        if (value !== null && value !== undefined && value !== '') {
          processedFilters[field] = value;
        }
      }
    });
  
    this.legajoService.searchLegajos(processedFilters, this.currentPage).subscribe(
      data => {
        this.legajos = data.results;
        this.totalPages = Math.ceil(data.count / this.page_size);
        this.isLoading = false; // Finalizar el indicador de carga
      },
      error => {
        console.error('Error en la búsqueda de legajos', error);
        this.isLoading = false; // Finalizar el indicador de carga en caso de error
      }
    );
  }

  getResultFields(): string[] {
    if (this.legajos.length > 0) {
      return Object.keys(this.legajos[0]);
    }
    return [];
  }
}
