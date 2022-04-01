import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { PublicacionInterface } from "../../models/publicacion-interface";
import { LabelsInterface } from "../../models/labels-interface";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  publicaciones: any;
  labels: any;
  etiquetaSeleccionada: any
  idEtiqueta:any;
  constructor(public userService: UserService, public router: Router) { }

  ngOnInit(): void {
    this.userService.getPublicaciones().subscribe((res: PublicacionInterface[]) => {
      this.publicaciones = res;

    })

    this.userService.getLabels().subscribe((res: LabelsInterface[]) => {
      this.labels = res;
      this.labels.unshift({
        "id_etiqueta": 50000,
        "nombre_etiqueta": "Todos"
      });
      this.etiquetaSeleccionada = this.labels[0]
    })
  }

  setEtiqueta(element: any) {
    this.idEtiqueta=this.etiquetaSeleccionada.id_etiqueta;
    console.log(this.idEtiqueta);
  }
  filtrar(){
    //Si es todos
    if(this.idEtiqueta==50000){
      this.userService.getPublicaciones().subscribe((res: PublicacionInterface[]) => {
        this.publicaciones = res;
  
      })
    }else{
      this.userService.getPubLabels(this.idEtiqueta).subscribe((res: PublicacionInterface[]) => {
        this.publicaciones = res;
  
      })
    }
  }

  translate(){
    this.userService.getTranslate().subscribe((res: PublicacionInterface[]) => {
      this.publicaciones = res;

    })
  }
}
