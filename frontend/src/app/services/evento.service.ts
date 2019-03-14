import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../models/evento.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {   }

  getEventos() {

    return this.http.get(`${this.uri}/eventos`);
  }

  getEventosRango(fechainicio: Date, fechafin: Date): Observable<Evento[]> {

    fechainicio.setHours(0, 0, 0, 0);
    fechafin.setHours(23, 59, 59, 999);

    const rango = {
      fechainicio: fechainicio,
      fechafin: fechafin
    };

    return this.http.post<Evento[]>(`${this.uri}/eventos/rango`, rango)
  }

  getEventoId(id): Observable<Evento> {

    return this.http.get<Evento>(`${this.uri}/eventos/${id}`);
  }

  addEvento(nombre, fechainicio, fechafin, lugar, ramas, creadopor) {

    const evento = {

      nombre: nombre,
      fechainicio: new Date(fechainicio),
      fechafin: new Date(fechafin),
      lugar: lugar,
      ramas: ramas,
      creadopor: creadopor
    };

    return this.http.post(`${this.uri}/eventos/crear`, evento);
  }

  updateEvento(id, nombre, fechainicio, fechafin, lugar, ramas, creadopor) {

    
    const evento = {

      nombre: nombre,
      fechainicio: fechainicio,
      fechafin: fechafin,
      lugar: lugar,
      ramas: ramas,
      creadopor: creadopor
    };

    return this.http.post(`${this.uri}/eventos/editar/${id}`, evento);
  }

  deleteEvento(id) {

    return this.http.get(`${this.uri}/eventos/eliminar/${id}`);
  }

  

  
}
