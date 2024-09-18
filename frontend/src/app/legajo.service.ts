import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LegajoService {
  // private apiUrl = 'http://localhost:8000/api/datos/basecentral/legajos/';
  private entidadUrl = 'http://localhost:8000/api/datos/basecentral/entidad/';
  private baseUrl = 'http://localhost:8000/api/datos/basecentral';



  constructor(private http: HttpClient) {}

  

   // Método para obtener la definición de la entidad
  getEntidadDefinition(entidad: string): Observable<any> {
    return this.http.get(`${this.entidadUrl}${entidad}`);
  }

  searchLegajos(entidad: string, filters: any, page: number = 1, ordering: string = 'clave', campos: string[] = []): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('ordering', ordering);

    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.append(key, filters[key]);
      }
    });

    if (campos.length > 0) {
      params = params.append('campos', campos.join(','));
    }

    return this.http.get(`${this.baseUrl}/${entidad}/`, { params });
  }
}
