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

  InsertUser(nombre: string, usuario:string,correo: string, pw: string, foto: string) {

    const url = environment.apiURl+"addUser"
    return this.http.post(
      url,
      {
        "nombre_usuario": nombre,
        "usuario_usuario": usuario,
        "pw_usuario": pw,
        "correo_usuario": correo,
        "foto_usuario": foto,
        "estado_usuario":"I"
      },
      { headers: this.headers }
    ).pipe(map(data => data));

  }
  uploadWebImage(foto:string){
    const url = environment.apiURl+"uploadWebCamImage"
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
    const url = environment.apiURl+"/";

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
    const url = environment.apiURl+"/login/reconocimiento";

    return this.http.post<any>(url,
      {
        "usuario_usuario": usuario,
        "imagen": imagen
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  updateUser(usuario:string,pw:string, nobmre:string,foto:string){
    const url = environment.apiURl+"updateUser";

    return this.http.post<any>(url,
      {
        "usuario_usuario": usuario,
        "pw_usuario": pw,
        "nombre_usuario":nobmre,
        "foto_usuario":foto
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  } 
  crearPublicacion(imagen_publicacion:string, contenido_publicaicon:string, id_usuario_publicacion:string, labels_publicacion:any){
    const url = environment.apiURl+"crearPublicacion";

    return this.http.post<any>(url,
      {
        "imagen_publicacion": imagen_publicacion,
        "contenido_publicaicon": contenido_publicaicon,
        "id_usuario_publicacion":id_usuario_publicacion,
        "labels_publicacion":labels_publicacion
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  getPublicaciones(){
    const url = environment.apiURl+"getPublicaciones";

    return this.http.get<any>(url,
      { headers: this.headers })
      .pipe(map(data => data));
  }

  getLabels(){
    const url = environment.apiURl+"getLabels";

    return this.http.get<any>(url,
      
      { headers: this.headers })
      .pipe(map(data => data));
  }

  getPubLabels(id_etiqueta:number){
    const url = environment.apiURl+"getPubLabels";

    return this.http.post<any>(url,
      {
        "id_etiqueta": id_etiqueta
      }
      , { headers: this.headers })
      .pipe(map(data => data));
  }

  getTranslate(){
    const url = environment.apiURl+"translate";

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

