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
  entidad = 'Legajo'; // Nombre de la entidad a consultar

  availableFields: string[] = []; // Campos disponibles para filtrar
  selectedFilters: { field: string, type: string }[] = []; // Filtros agregados por el usuario
  remainingFields: string[] = []; // Campos que aún no han sido seleccionados


  constructor(private legajoService: LegajoService) {}

  ngOnInit(): void {
    // Obtener la definición de la entidad al inicializar el componente
    this.legajoService.getEntidadDefinition(this.entidad).subscribe(definition => {
      this.entidadDefinition = definition;
      this.availableFields = Object.keys(this.entidadDefinition);
      console.log(this.availableFields)
      this.remainingFields = [...this.availableFields];
    });
  }

   // Función para agregar un nuevo filtro
   addFilter(): void {
    // Si aún hay campos disponibles
    if (this.remainingFields.length > 0) {
      const field = ''; // Valor por defecto
      const type = ''; // Tipo de campo
      this.selectedFilters.push({ field, type });
    }
  }

  // Función para actualizar el tipo cuando se selecciona un campo
  onFieldSelected(filterIndex: number): void {
    const field = this.selectedFilters[filterIndex].field;
    const type = this.entidadDefinition[field];
    this.selectedFilters[filterIndex].type = type;

    // Eliminar el campo de los campos disponibles para evitar duplicados
    this.remainingFields = this.remainingFields.filter(f => f !== field);
  }

   // Función para eliminar un filtro
   removeFilter(index: number): void {
    const field = this.selectedFilters[index].field;

    // Agregar el campo nuevamente a los campos disponibles
    if (field) {
      this.remainingFields.push(field);
    }

    // Eliminar el filtro de la lista
    this.selectedFilters.splice(index, 1);
  }

  search(page: number = 1): void {
    this.currentPage = page;
    
    // Construir los filtros a partir de los filtros seleccionados
    const processedFilters: any = {};
  
    this.selectedFilters.forEach(filter => {
      const field = filter.field;
      const type = filter.type;
  
      if (type === 'DateTimeField' || field.includes('fecha')) {
        // Procesar fechas como rango
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
  
    this.legajoService.searchLegajos(processedFilters, this.currentPage).subscribe(data => {
      this.legajos = data.results;
      this.totalPages = Math.ceil(data.count / this.page_size);
    });
  }

    // Función para obtener los campos sin duplicados (ejcluir campos como 'fecha_alta_date_from')
    getFields(): string[] {
      return Object.keys(this.entidadDefinition).filter(field => {
        return !field.endsWith('_from') && !field.endsWith('_to');
      });
    }
  
   // Función para obtener los campos a mostrar en los resultados
   getResultFields(): string[] {
    if (this.legajos.length > 0) {
      return Object.keys(this.legajos[0]);
    }
    return [];
  }
}
