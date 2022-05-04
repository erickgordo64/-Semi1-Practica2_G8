import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { listPhotos } from 'src/app/models/listNamesImg';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.css']
})
export class CarruselComponent implements OnInit {


  contadorSiguiente: any = -1;
  contadorAnterior: any = 0;
  listaDeLinks: listPhotos[];
  reproducirIntro: boolean = true;
  nombreAudio:string="";
  imgURL: any = "https://albumpractica1.s3.amazonaws.com/fotos/foto0.jpg";
  public imagePath: any;
  idUusarioLogueado:string="";




  constructor(private api:UserService, private router:Router, public userService: UserService) {
    this.listaDeLinks=[];
  }




  ngOnInit(): void {
      console.log("mensaje aceptado");
      
      this.api.getFotos(this.userService.getCurrentUser()['id']).subscribe((data: listPhotos[]) => {
        this.listaDeLinks = data;
      })


    //valido la existencia del token si no se ha cerrado sesión 
    if(localStorage.getItem('UsuarioLogueado')){ 
      let array =  this.userService.getCurrentUser()['id'];
      console.log(array);
    }else{
      this.router.navigate(['/login']);
    }


  }

  retornarImagenSiguiente(event: any) {
    this.contadorSiguiente++;
    if (this.contadorSiguiente == this.listaDeLinks.length) {
      this.contadorSiguiente = 0;
    }
    this.imgURL = this.listaDeLinks[this.contadorSiguiente].link;
    console.log(this.imgURL);
    this.nombreAudio = this.listaDeLinks[this.contadorSiguiente].link;
    this.getBase64Image();
  }


  retornarImagenAnterior(event: any) {
    this.contadorAnterior = this.contadorSiguiente;
    this.contadorAnterior--;
    if (this.contadorAnterior < 0) {
      this.contadorAnterior = this.listaDeLinks.length - 1;
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

      this.api.postImagen64_Texto(imgBase64, this.nombreAudio).subscribe((res) => {
        console.log("en el CARRUSEL Texto  ===" + res);

        this.api.postImagen64_Rostro(imgBase64, this.nombreAudio).subscribe((res) => {
          console.log("en el CARRUSEL Rostro ===" + res);
          this.reproducir();
        });

      });
    }
    img.src = url;
  }


  intro() {
    //const audioIntro = new Audio('assets/intro.mp3');
    const audioIntro = new Audio('https://albumpractica1.s3.amazonaws.com/audio/intro.mp3');
    audioIntro.play();
  }




  reproducir() {
    console.log("reproduciendo audios generados");
    const audioTexto = new Audio('C:/Users/krlos/Documents/GitHub/BackendNode/recursos/Texto.mp3');  //links de los audios en el servidor
    audioTexto.play();
    audioTexto.addEventListener('ended', function () {
      const audioRostro = new Audio('C:/Users/krlos/Documents/GitHub/BackendNode/recursos/Rostro.mp3'); //links del audio en el servidor
      audioRostro.play();
    }, true);

  }

}
