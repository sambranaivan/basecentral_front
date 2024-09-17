import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LegajoService {
  private apiUrl = 'http://localhost:8000/api/datos/basecentral/legajos/';
  private entidadUrl = 'http://localhost:8000/api/datos/basecentral/entidad/';


  constructor(private http: HttpClient) {}

   // Método para obtener la definición de la entidad
  getEntidadDefinition(entidad: string): Observable<any> {
    return this.http.get(`${this.entidadUrl}${entidad}`);
  }

  searchLegajos(filters: any, page: number = 1, ordering: string = 'clave'): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('ordering', ordering);
  
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.append(key, filters[key]);
      }
    });
  
    return this.http.get(this.apiUrl, { params });
  }
}
