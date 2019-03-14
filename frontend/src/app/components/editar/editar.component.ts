import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EventoService } from 'src/app/services/evento.service';

import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDatepicker, MatChipList, MatChipInput, MatSnackBar} from '@angular/material';
import {Observable, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Evento } from 'src/app/models/evento.model';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['../../components/crear/crear.component.scss']
})
export class EditarComponent implements OnInit {

  editForm: FormGroup;
  id: String;
  @Input() evento: Evento;
  volveraeventos: Boolean;
  editado: Subject<Boolean> = new Subject();

  //Strings
  nombre = new FormControl('', Validators.required);
  lugar = new FormControl('');
  creadopor = new FormControl('');
  
  //Fechas
  fechainicio = new FormControl(new Date(), Validators.required);
  fechafin = new FormControl(new Date(), Validators.required);

  //Horas
  horainicio = new FormControl(new Date(), Validators.required);
  horafin = new FormControl(new Date(), Validators.required);

  //Ramas
  @ViewChild('chipList') chip: MatChipInput;
  visible = true
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  filteredRamas: Observable<string[]>;
  ramas: string[] = [];
  ramasCtrl = new FormControl(this.ramas);
  allRamas: string[] = ['Castores', 'Manada', 'Unidad', 'Caminantes', 'Rovers', 'Grupo', 'Dirigentes']; //Maybe ramas podría pedirse al server despues?

  @ViewChild('ramasInput') ramasInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private eventoService: EventoService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar) { 

    this.filteredRamas = this.ramasCtrl.valueChanges.pipe(
      startWith(null),
      map((rama: string | null) => rama ? this._filter(rama) : this.allRamas.slice()));

      this.editForm = this.fb.group({

        nombre: this.nombre,
        fechainicio: this.fechainicio,
        horainicio: this.horainicio,
        fechafin: this.fechafin,
        horafin: this.horafin,
        lugar: this.lugar,
        ramasCtrl: this.ramasCtrl,
        creadopor: this.creadopor
      });
  }

  //Función que llama el botón enviar del formulario
  editarEvento() {

    this.agregarHoras(this.horainicio, this.fechainicio);
    this.agregarHoras(this.horafin, this.fechafin);

    if(this.fechainicio.value <= this.fechafin.value) {

      this.eventoService.updateEvento(this.id, this.nombre.value, this.fechainicio.value, this.fechafin.value, this.lugar.value, this.ramas, this.creadopor.value).subscribe(() => {

        this.snackBar.open('Evento actualizado correctamente', 'OK', {
          duration: 3000,
        });
  
        if(this.volveraeventos)
          this.router.navigate(['/eventos']);

        this.editado.next(true);
      });
    }
    else {

      this.snackBar.open('La fecha y hora de inicio deben ser anteriores a la fecha y hora de fin', 'OK', {
        duration: 3000,
      });
    }
  }

  agregarHoras(horas: FormControl, fecha: FormControl) {

    console.log(horas.value);

    var horasaux: String = horas.value;

    console.log(horasaux);
    
    fecha.value.setHours(parseInt(horasaux.split(":")[0]));
    fecha.value.setMinutes(parseInt(horasaux.split(":")[1]));
  }

  //Filtro de ramas
  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Agrega rama
      if ((value || '').trim() && !this.ramas.includes(value.trim())) {
        
        this.ramas.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.ramasCtrl.setValue(null);
    }
  }

  remove(rama: string): void {
    const index = this.ramas.indexOf(rama);

    if (index >= 0) {
      this.ramas.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    
    if(!this.ramas.includes(event.option.viewValue))
      this.ramas.push(event.option.viewValue);
    
    this.ramasInput.nativeElement.value = '';
    this.ramasCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allRamas.filter(rama => rama.toLowerCase().indexOf(filterValue) === 0);
  }
  //Fin filtro de ramas

  ngOnInit() {

    if(this.evento == null) {
      
      this.route.params.subscribe(params => {
      
        this.id = params.id;
        
        this.eventoService.getEventoId(this.id).subscribe(res => {
          
          this.evento = res;
          this.volveraeventos = true;
          console.log(res);
          this.nombre.setValue(this.evento.nombre);
          this.fechainicio.setValue(new Date(this.evento.fechainicio));
          this.setearHoras(this.horainicio, this.evento.fechainicio);
          this.fechafin.setValue(new Date(this.evento.fechafin));
          this.setearHoras(this.horafin, this.evento.fechafin);
          this.lugar.setValue(this.evento.lugar);
          this.ramas = this.evento.ramas;
          this.creadopor.setValue(this.evento.creadopor);
        });
      });
    }
    else {
      
      this.volveraeventos = false;
      this.id = this.evento._id;
      this.nombre.setValue(this.evento.nombre);
      this.fechainicio.setValue(new Date(this.evento.fechainicio));
      this.setearHoras(this.horainicio, this.evento.fechainicio);
      this.fechafin.setValue(new Date(this.evento.fechafin));
      this.setearHoras(this.horafin, this.evento.fechafin);
      this.lugar.setValue(this.evento.lugar);
      this.ramas = this.evento.ramas;
      this.creadopor.setValue(this.evento.creadopor);
    }
  }

  setearHoras(hora: FormControl, fecha: Date) {

    var auxfecha: Date = new Date(fecha);
    hora.setValue(auxfecha.toTimeString().substr(0, 5));
  }

}
