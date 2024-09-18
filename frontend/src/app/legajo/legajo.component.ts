import { Component, OnInit } from '@angular/core';
import { LegajoService } from '../legajo.service';
import { ActivatedRoute } from '@angular/router';

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
  entidad: string = 'Legajo';
  isLoading: boolean = false;
  displayedColumns: string[] = ['clave', 'estado', 'fecha_alta_date','caratula', 'acciones'];

  availableFields: string[] = [];
  selectedFilters: { field: string, type: string }[] = [];
  remainingFields: string[] = [];

  constructor(
    private legajoService: LegajoService,   
    private route: ActivatedRoute) {}

  ngOnInit(): void {

     // Get the entity from the route parameters
     this.route.params.subscribe(params => {
      this.entidad = params['entity'];
      this.loadEntityDefinition();
    });
  }

  loadEntityDefinition(): void {
    // Obtain the definition of the entity
    this.legajoService.getEntidadDefinition(this.entidad).subscribe(definition => {
      this.entidadDefinition = definition;
      this.availableFields = Object.keys(this.entidadDefinition);
      this.remainingFields = [...this.availableFields];
      // Reset filters and results when the entity changes
      this.filters = {};
      this.selectedFilters = [];
      this.legajos = [];
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
    this.isLoading = true;
  
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
  
    // Specify the fields you want to retrieve, or leave empty to get all fields
    const campos = ['clave','caratula']; // Or specify ['clave', 'estado', ...] if needed
  
    this.legajoService.searchLegajos(this.entidad, processedFilters, this.currentPage, 'clave', campos).subscribe(
      data => {
        this.legajos = data.results;
        this.totalPages = Math.ceil(data.count / data.page_size);
        this.isLoading = false;
      },
      error => {
        console.error('Error en la búsqueda', error);
        this.isLoading = false;
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
