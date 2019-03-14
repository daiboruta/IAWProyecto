import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EventoService } from 'src/app/services/evento.service';

import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatChipInput, MatSnackBar} from '@angular/material';
import {Observable, Subject} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {

  createForm: FormGroup;
  creado: Subject<Boolean> = new Subject();
  public volveraeventos: Boolean = true;

  //Strings
  nombre = new FormControl('', Validators.required);
  lugar = new FormControl('');
  creadopor = new FormControl('');

  //Fechas
  fechainicio = new FormControl(new Date(), Validators.required);
  fechafin = new FormControl(new Date(), Validators.required);

  //Horas
  horainicio = new FormControl(new Date("00:00"), Validators.required);
  horafin = new FormControl(new Date("23:59"), Validators.required);

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

  //Constructor
  constructor(private eventoService: EventoService, private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) { 

    this.filteredRamas = this.ramasCtrl.valueChanges.pipe(
      startWith(null),
      map((rama: string | null) => rama ? this._filter(rama) : this.allRamas.slice()));

    this.createForm = this.fb.group({

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
  crearEvento() {
    
    this.agregarHoras(this.horainicio, this.fechainicio);
    this.agregarHoras(this.horafin, this.fechafin);

    if(this.fechainicio.value <= this.fechafin.value) {

      this.eventoService.addEvento(this.nombre.value, this.fechainicio.value, this.fechafin.value, this.lugar.value, this.ramas, this.creadopor.value).subscribe(() => {

        this.snackBar.open('Evento guardado correctamente!', null, {
          duration: 3000,
        });
        
        if(this.volveraeventos)
          this.router.navigate(['/eventos']);

        this.creado.next(true);
      });
    }
    else {

      this.snackBar.open('La fecha y hora de inicio deben ser anteriores a la fecha y hora de fin', 'OK', {
        duration: 3000,
      });
    }
  }

  agregarHoras(horas: FormControl, fecha: FormControl) {

    var horasaux: String = horas.value;
    
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
  }

}
