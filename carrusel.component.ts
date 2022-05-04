import { Component, OnInit } from '@angular/core';
import { auditTime, Observable, Subscriber } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { listPhotos } from 'src/app/models/listNamesImg';


@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css']
})
export class CarruselComponent implements OnInit {

  contadorSiguiente:any = -1;
  contadorAnterior:any = 0;
  listaDeLinks: listPhotos[];
  nombreTexto:string="";
  nombreRostro:string="";
  reproducirIntro:boolean=true;
  constructor(private api:ApiService) { 
    
   }


   
  imgURL: any = "https://albumpractica1.s3.amazonaws.com/fotos/foto0.jpg";
  nombreAudio:string="";
  public imagePath: any;
  
  





  ngOnInit(): void {
    let aceptar = window.confirm("hola");

    //lleno mi lista de los links de las fotos en mi bucket
    if(aceptar === true){
      console.log("mensaje aceptado");
      this.api.getFotos().subscribe((data: listPhotos[])=>{
        this.listaDeLinks = data;
      })
      aceptar=false;
    }
  }

  retornarImagenSiguiente(event: any){
    this.contadorSiguiente++;
    if(this.contadorSiguiente==this.listaDeLinks.length){
      this.contadorSiguiente=0;
    }
    this.imgURL = this.listaDeLinks[this.contadorSiguiente].link;
    this.nombreAudio = this.listaDeLinks[this.contadorSiguiente].link;
    this.getBase64Image();
  }

  
  retornarImagenAnterior(event:any){
    this.contadorAnterior = this.contadorSiguiente;
    this.contadorAnterior--;
    if(this.contadorAnterior<0){
      this.contadorAnterior = this.listaDeLinks.length-1;
    }
    this.imgURL = this.listaDeLinks[this.contadorAnterior].link;
    this.contadorSiguiente = this.contadorAnterior;
    this.nombreAudio = this.listaDeLinks[this.contadorAnterior].link;
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

      this.nombreTexto =imgBase64.substring(15,30).replace('/',"4p");
      this.nombreRostro =imgBase64.substring(30,45).replace('/',"pi");

      this.api.postImagen64_Texto(imgBase64, this.nombreAudio).subscribe((res)=>{
        console.log("en el CARRUSEL Texto  ===" + res);

        this.api.postImagen64_Rostro(imgBase64, this.nombreAudio).subscribe((res)=>{
          console.log("en el CARRUSEL Rostro ===" + res);
          this.reproducir();
        });

      });
    }
    img.src = url;
  }
     

  intro(){
    const audioIntro = new Audio('assets/intro.mp3');
    audioIntro.play();    
  }
  

  
  reproducir() {    
    
    setTimeout(() => 
    {
        const audioTexto = new Audio('assets/texto.mp3');
        audioTexto.play();
        audioTexto.addEventListener('ended', function(){
          const audioRostro = new Audio('assets/rostros.mp3');
          audioRostro.play();
        }, true);
    
    },2000);

  }
















}
