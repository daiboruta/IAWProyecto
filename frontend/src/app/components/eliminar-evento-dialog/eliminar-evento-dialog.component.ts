import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-eliminar-evento-dialog',
  templateUrl: './eliminar-evento-dialog.component.html',
  styleUrls: ['./eliminar-evento-dialog.component.scss']
})
export class EliminarEventoDialogComponent implements OnInit {

  nombreEvento: string;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

    this.nombreEvento = data.nombre;
  }

  ngOnInit() {
  }

}
