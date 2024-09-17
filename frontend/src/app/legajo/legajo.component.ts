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

  constructor(private legajoService: LegajoService) {}

  ngOnInit(): void {
    // Obtener la definición de la entidad al inicializar el componente
    this.legajoService.getEntidadDefinition(this.entidad).subscribe(definition => {
      this.entidadDefinition = definition;
      // Inicializar los filtros con valores vacíos
      Object.keys(this.entidadDefinition).forEach(key => {
        this.filters[key] = '';
      });
    });
  }

  search(page: number = 1): void {
    this.currentPage = page;

    // Asegurarnos de que los campos de fecha estén en el formato 'YYYY-MM-DD'
    const processedFilters = { ...this.filters };
    Object.keys(processedFilters).forEach(key => {
      if (processedFilters[key] instanceof Date) {
        const date = processedFilters[key] as Date;
        processedFilters[key] = date.toISOString().split('T')[0];
      }
    });

    this.legajoService.searchLegajos(this.filters, this.currentPage).subscribe(data => {
      this.legajos = data.results;
      this.totalPages = Math.ceil(data.count / this.page_size); // Suponiendo PAGE_SIZE = 10
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
