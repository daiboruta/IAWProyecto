import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MesComponent } from './components/mes/mes.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
import { EventosComponent } from './components/eventos/eventos.component';

import { MatToolbarModule, 
         MatFormFieldModule, 
         MatInputModule, 
         MatOptionModule, 
         MatSelectModule, 
         MatIconModule, 
         MatButtonModule, 
         MatCardModule, 
         MatTableModule, 
         MatDividerModule, 
         MatSnackBarModule,
         MatDatepickerModule,
         MatChipsModule, 
         MatAutocompleteModule,
         MatNativeDateModule,
         MatDialogModule,
         MatTabsModule,
         MatTooltipModule,
         MatSortModule,
         MatExpansionModule} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EliminarEventoDialogComponent } from './components/eliminar-evento-dialog/eliminar-evento-dialog.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuardService } from './services/auth-guard.service';


const routes: Routes = [
  { path: 'crear', component: CrearComponent },
  { path: 'editar/:id', component: EditarComponent },
  { path: 'mes', component: MesComponent, canActivate: [AuthGuardService] },
  { path: 'eventos', component: EventosComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    MesComponent,
    CrearComponent,
    EditarComponent,
    EventosComponent,
    EliminarEventoDialogComponent,
    CalendarComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSortModule,
    HttpClientModule
  ],
  providers: [AuthGuardService],
  entryComponents: [EliminarEventoDialogComponent, EditarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }