import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CalendarDate } from 'src/app/models/calendar-date.model';
import * as moment from 'moment';
import { EventoService } from 'src/app/services/evento.service';
import { map } from 'rxjs/operators';
import { Evento } from 'src/app/models/evento.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {

  currentDate = moment();
  dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];

  @Input() selectedDates: CalendarDate[] = [];
  @Output() onSelectDate = new EventEmitter<CalendarDate>();

  constructor(private eventoService: EventoService) { }

  ngOnInit(): void {
    
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes.selectedDates &&
        changes.selectedDates.currentValue &&
        changes.selectedDates.currentValue.length  > 1) {
      
      this.sortedDates = changes.selectedDates.currentValue.sort((m: CalendarDate) => m.mDate.valueOf());
      this.generateCalendar();
    }
  }

  //date checkers
  isToday(date: moment.Moment): boolean {
    
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    
    return this.selectedDates.findIndex((selectedDate) => { return moment(date).isSame(selectedDate.mDate, 'day') }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    
    this.selectedDates = [date];
    this.onSelectDate.emit(date);
  }

  // actions from calendar
  prevMonth(): void {
    
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }

  nextMonth(): void {
    
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  firstMonth(): void {
    
    this.currentDate = moment(this.currentDate).startOf('year');
    this.generateCalendar();
  }

  lastMonth(): void {
    
    this.currentDate = moment(this.currentDate).endOf('year');
    this.generateCalendar();
  }

  prevYear(): void {
    
    this.currentDate = moment(this.currentDate).subtract(1, 'year');
    this.generateCalendar();
  }

  nextYear(): void {
    
    this.currentDate = moment(this.currentDate).add(1, 'year');
    this.generateCalendar();
  }

  // generate the calendar grid
  generateCalendar(): void {
    
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    
    while (dates.length > 0) {
      
      weeks.push(dates.splice(0, 7));
    }
    
    this.weeks = weeks;
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    
    var arreglo = Array.apply(null, {length: 42}).map(function(_value, index){
      
      return index + start;
    });

    var eventolista = this.eventoService.getEventosRango(moment(firstDayOfGrid).toDate(), moment(firstDayOfGrid).add(42, "days").toDate()); 


    return arreglo.map((date: number): CalendarDate => {
              
      const d = moment(firstDayOfGrid).date(date);

      console.log(eventolista.pipe(map(lista => lista.filter(evento => 
        moment(evento.fechainicio).isSame(d) ||
        moment(evento.fechafin).isSame(d) ||
        (moment(d).isBetween(evento.fechainicio, evento.fechafin))))));

      return {
        
        today: this.isToday(d),
        selected: this.isSelected(d),
        mDate: d,
        eventos: eventolista.pipe(map(lista => lista.filter(evento => 
          d.isSame(evento.fechainicio, "day") ||
          d.isSame(evento.fechafin, "day") ||
          (d.isBetween(evento.fechainicio, evento.fechafin)))))
      };
    });
  }

  formatearMes(currentMoment: moment.Moment): string {

    return currentMoment.toDate().toLocaleString("es-AR", {month: "long"});
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
}
