import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { UserInterface } from '../models/user-interface';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router) { }
  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  })

  InsertUser(nombre: string, usuario: string, contraseña: string, correo: string,imagen: string) {

    const url = "http://localhost:3000" + "/Usuario"
    return this.http.post(
      url,
      {
        nombre,
        usuario,
        contraseña,
        correo,
        imagen
      },
      { headers: this.headers }
    ).pipe(map(data => data));

  }
  uploadWebImage(foto: string) {
    const url = "http://localhost:3000" + "/uploadWebCamImage"
    return this.http.post(
      url,
      {
        "id": "foto",
        "foto": foto,
      },
      { headers: this.headers }
    ).pipe(map(data => data));

  }

  Login(usuario: string, contraseña: string) {
    const url = "http://localhost:3000" + "/";

    console.log(usuario, contraseña)

    return this.http.post<any>(url,
      {
        usuario,
        contraseña
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  loginReconocimiento(usuario: string, imagen: string) {
    const url = "http://localhost:3000" + "/reconocimiento";

    return this.http.post<any>(url,
      {
        usuario,
        imagen
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  updateUser(usuario: string, pw: string, nobmre: string, foto: string) {
    const url = "http://localhost:3000" + "/updateUser";

    return this.http.post<any>(url,
      {
        "usuario_usuario": usuario,
        "pw_usuario": pw,
        "nombre_usuario": nobmre,
        "foto_usuario": foto
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }
  crearPublicacion(imagen: string, descripcion: string, idusuario: any, nombre: any) {
    const url = "http://localhost:3000" + "/Imagen";
    console.log(idusuario)
    return this.http.post<any>(url,
      {
        imagen,
        descripcion,
        idusuario,
        nombre
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  getPublicaciones(idusuario: any) {
    const url = "http://localhost:3000" + `/Imagen/?idusuario=${idusuario}`;

    return this.http.get<any>(url,
      { headers: this.headers })
      .pipe(map(data => data));
  }

  postImagen64_Texto(imagen: string, nombreArchivo: string) {
    const direccion = "http://localhost:3000/pollyTexto";

    return this.http.post<any>(direccion,
      {
        imagen,
        nombreArchivo
      }, { headers: this.headers })
      .pipe(map(data => data));
  }

  postImagen64_Rostro(imagen: string, nombreArchivo: string) {
    const direccion = "http://localhost:3000/pollyRostro";
    console.log("imagen aki");
    console.log(nombreArchivo);
    return this.http.post<any>(direccion,
      {
        imagen,
        nombreArchivo
      }, { headers: this.headers })
      .pipe(map(data => data));
  }

  getFotos(id:string){
    const direccion = "http://localhost:3000/retornarLinks/"+id;
    return this.http.get<any>(direccion,
      {headers: this.headers})
      .pipe(map(data=>data));
  }

  getLabels() {
    const url = "http://localhost:3000" + "/getLabels";

    return this.http.get<any>(url,

      { headers: this.headers })
      .pipe(map(data => data));
  }

  getPubLabels(id_etiqueta: number) {
    const url = "http://localhost:3000" + "/getPubLabels";

    return this.http.post<any>(url,
      {
        "id_etiqueta": id_etiqueta
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  getTranslate(idusuario: any) {
    const url = "http://localhost:3000" + `/ImagenTraducir/?idusuario=${idusuario}`;

    return this.http.get<any>(url,
      { headers: this.headers })
      .pipe(map(data => data));
  }

  setCurrentUser(user: UserInterface) {
    let user_string = JSON.stringify(user);
    localStorage.setItem('UsuarioLogueado', user_string);
  }
  //TODO: GET CURRENT USER
  getCurrentUser() {
    let userCurrent = localStorage.getItem('UsuarioLogueado');
    if (userCurrent) {
      let user_json = JSON.parse(userCurrent);
      return user_json;
    } else {
      return null;
    }
  }

  logout() {
    localStorage.removeItem("UsuarioLogueado");
    this.router.navigate(['/login']);
  }


}

