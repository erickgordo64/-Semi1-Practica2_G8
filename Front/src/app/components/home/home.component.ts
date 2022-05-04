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
  idEtiqueta: any;
  idusuario: any;
  foto: string = "";
  contadorSiguiente: any = -1;
  contadorAnterior: any = 0;
  nombreTexto: string = "";
  nombreRostro: string = "";
  reproducirIntro: boolean = true;
  imgURL: any;
  nombreAudio: string = "";
  public imagePath: any;
  constructor(public userService: UserService, public router: Router) { }

  ngOnInit(): void {

    this.idusuario = this.userService.getCurrentUser()['id'];
    console.log(this.idusuario);
    this.userService.getPublicaciones(this.idusuario).subscribe((res: PublicacionInterface[]) => {
      this.publicaciones = res;
    })

    this.foto = this.userService.getCurrentUser()['ubicacion'];
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
    this.idEtiqueta = this.etiquetaSeleccionada.id_etiqueta;
    console.log(this.idEtiqueta);
  }
  filtrar() {
    //Si es todos
    if (this.idEtiqueta == 50000) {
      this.userService.getPublicaciones(this.idusuario).subscribe((res: PublicacionInterface[]) => {
        this.publicaciones = res;

      })
    } else {
      this.userService.getPubLabels(this.idEtiqueta).subscribe((res: PublicacionInterface[]) => {
        this.publicaciones = res;

      })
    }
  }

  translate() {
    this.userService.getTranslate(this.idusuario).subscribe((res: PublicacionInterface[]) => {
      this.publicaciones = res;

    })
  }


  retornarImagenSiguiente(event: any) {
    this.contadorSiguiente++;
    if (this.contadorSiguiente == this.publicaciones.length) {
      this.contadorSiguiente = 0;
    }
    this.imgURL = this.publicaciones[this.contadorSiguiente].ubicacion;
    this.nombreAudio = this.publicaciones[this.contadorSiguiente].ubicacion;
    this.getBase64Image();
  }

  retornarImagenAnterior(event: any) {
    this.contadorAnterior = this.contadorSiguiente;
    this.contadorAnterior--;
    if (this.contadorAnterior < 0) {
      this.contadorAnterior = this.publicaciones.length - 1;
    }
    this.imgURL = this.publicaciones[this.contadorAnterior].link;
    this.contadorSiguiente = this.contadorAnterior;
    this.nombreAudio = this.publicaciones[this.contadorAnterior].link;
    this.getBase64Image();
  }

  getBase64Image = () => {
    var url = this.imgURL;
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      var imgBase64 = canvas.toDataURL("image/png");
      imgBase64 = imgBase64.replace("data:image/png;base64,", "");
      //console.log(this.contador +"   "+imgBase64);

      this.nombreTexto = imgBase64.substring(15, 30).replace('/', "4p");
      this.nombreRostro = imgBase64.substring(30, 45).replace('/', "pi");

      /*this.userService.postImagen64_Texto(imgBase64, this.nombreAudio).subscribe((res) => {
        console.log("en el CARRUSEL Texto  ===" + res);

        this.userService.postImagen64_Rostro(imgBase64, this.nombreAudio).subscribe((res) => {
          console.log("en el CARRUSEL Rostro ===" + res);
          this.reproducir();
        });

      });*/
    }
    img.src = url;
  }

  reproducir() {

    setTimeout(() => {
      const audioTexto = new Audio('assets/texto.mp3');
      audioTexto.play();
      audioTexto.addEventListener('ended', function () {
        const audioRostro = new Audio('assets/rostros.mp3');
        audioRostro.play();
      }, true);

    }, 2000);
  }
}
