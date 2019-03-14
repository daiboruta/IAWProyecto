import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableDataSource, MatDialog, MatDialogConfig, MatSnackBar, MatSort } from '@angular/material';

import { Evento } from '../../models/evento.model';
import { EventoService } from '../../services/evento.service';
import { EliminarEventoDialogComponent } from '../eliminar-evento-dialog/eliminar-evento-dialog.component';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  eventos: Evento[];
  displayedColumns = ['nombre', 'fechainicio', 'fechafin', 'lugar', 'ramas', 'creadopor', 'actions']
  
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Evento>;

  constructor(private eventoService: EventoService, private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {

    this.listarEventos();
  }

  //Opciones para el formateo de fecha
  fechaoptions = {//weekday: 'short',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit' };

  formatearFecha(fecha: string) {

    return new Date(fecha).toLocaleString("es-AR", this.fechaoptions);
  }

  listarEventos() {

    this.eventoService.getEventos().subscribe((data: Evento[]) => {

      this.eventos = data;
      this.dataSource = new MatTableDataSource(this.eventos);
      this.dataSource.sort = this.sort;
      console.log('Datos pedidos...');
      console.log(this.eventos);
    });
  }

  editarEvento(id) {

    this.router.navigate([`/editar/${id}`]);
  }

  eliminarEvento(id, eventonombre) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '250 px';
    dialogConfig.data = {

      nombre: eventonombre
    }

    const dialogRef = this.dialog.open(EliminarEventoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      
      if(result) {

        this.eventoService.deleteEvento(id).subscribe(() => {

          this.listarEventos();

          this.snackBar.open('Evento eliminado correctamente!', null, {
            duration: 3000,
          });
        })
      }
    });
  }
}
