import * as moment from 'moment';
import { Evento } from './evento.model';
import { Observable } from 'rxjs';

export interface CalendarDate {

    mDate: moment.Moment;
    selected?: boolean;
    today?: boolean;
    eventos: Observable<Evento[]>
}
