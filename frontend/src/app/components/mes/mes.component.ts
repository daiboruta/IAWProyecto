import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentFactory, ComponentRef, Output, EventEmitter } from '@angular/core';
import { MatTabGroup, MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { CalendarDate } from 'src/app/models/calendar-date.model';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/models/evento.model';
import { EditarComponent } from '../editar/editar.component';
import { EliminarEventoDialogComponent } from '../eliminar-evento-dialog/eliminar-evento-dialog.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { CrearComponent } from '../crear/crear.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserDetails } from '../../models/user-details'

@Component({
  selector: 'app-mes',
  templateUrl: './mes.component.html',
  styleUrls: ['./mes.component.scss']
})
export class MesComponent implements OnInit {

  private fecha: CalendarDate;
  public proxeventos: Evento[];
  public eventoseleccionado: Evento;
  private tabseleccionada = 1;
  
  @ViewChild("calendario") calendario: CalendarComponent;

  @ViewChild("editor", { read: ViewContainerRef }) container;
  componentRef: any;
  details: UserDetails;

  constructor(private eventoService: EventoService, private resolver: ComponentFactoryResolver, public dialog: MatDialog, private snackBar: MatSnackBar, private auth: AuthenticationService) { }

  ngOnInit() {

    this.listarProxEventos();
    this.eventoseleccionado = null;

    /* this.auth.calendario().subscribe(user => {
      
      this.details = user;
    }, (err) => {
      
      console.error(err);
    }); */
  }

  listarProxEventos() {

    const hoy = new Date();
    const fin = new Date();
    fin.setMonth(hoy.getMonth() + 1);

    this.eventoService.getEventosRango(hoy, fin).subscribe((data: Evento[]) => {

      this.proxeventos = data;
    });
  }

  crear() {

    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(CrearComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.volveraeventos = false;
    this.componentRef.instance.creado.subscribe(() => {
      
      this.listarProxEventos();
      this.actualizarCalendario();
      this.tabseleccionada = 1;
      this.container.clear();
    });
  }

  editar(evento: Evento) {

    this.tabseleccionada = 2;
    this.eventoseleccionado = evento;
    this.container.clear();
    const factory = this.resolver.resolveComponentFactory(EditarComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.evento = evento;
    this.componentRef.instance.editado.subscribe(() => {
      
      this.listarProxEventos();
      this.actualizarCalendario();
      this.tabseleccionada = 1;
      this.container.clear();
    });
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

          this.listarProxEventos();
          this.actualizarCalendario();

          this.snackBar.open('Evento eliminado correctamente!', null, {
            duration: 3000,
          });
        })
      }
    });
  }

  getFecha() : string {

    if(this.fecha == null || this.fecha.today)
      return "Hoy";
    else
      return this.fecha.mDate.format("DD/MM");
  }

  onSelectDate(fechacal: CalendarDate) {

    this.fecha = fechacal;
    this.tabseleccionada = 0;
  }

  getColor(categoria: string): string {
    
    switch(categoria.toLowerCase()) {

      case 'castores': return 'darkorange';
      case 'manada': return 'gold';
      case 'unidad': return 'green';
      case 'caminantes': return 'dodgerblue';
      case 'rovers': return 'crimson';
      case 'dirigentes': return 'peru';
      case 'grupo': return 'darkviolet';
      default: 'black';
    }
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

  actualizarCalendario() {

    this.calendario.generateCalendar();
  }

  ngOnDestroy() {
    
    if(this.componentRef != null)
      this.componentRef.destroy();    
  }

}
