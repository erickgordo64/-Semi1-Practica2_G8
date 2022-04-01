import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from "@angular/router";
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-insertar-usuario',
  templateUrl: './insertar-usuario.component.html',
  styleUrls: ['./insertar-usuario.component.css']
})
export class InsertarUsuarioComponent implements OnInit {

  imgURL: any = "https://t4.ftcdn.net/jpg/01/19/32/93/240_F_119329387_sUTbUdeyhk0nuhNw5WaFvOyQFmxeppjX.jpg";
  public message: string = "";
  public imagePath: any;
  constructor(public userService: UserService, private http: HttpClient, public router: Router) { }
  nombre: string = "";
  usuario: string = "";
  password: string = "";
  confirmarPassword: string = "";
  email: string = "";
  uploadedFiles: Array<File> = [];
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  // toggle webcam on/off
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = "";

  public errors: WebcamInitError[] = [];
  // latest snapshot
  public webcamImage: any = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();



  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  async addUser() {
    if (this.nombre === "" || this.usuario === "" || this.password === "" || this.confirmarPassword === "" || this.email === "") {
      alert("Debe llenar todos los campos");
    } else if (this.password != this.confirmarPassword) {
      alert("La contrasena no coincide con la confirmacion");

    } else if (this.imgURL != "https://t4.ftcdn.net/jpg/01/19/32/93/240_F_119329387_sUTbUdeyhk0nuhNw5WaFvOyQFmxeppjX.jpg") {
      let formData = new FormData();
      var asyncResult: any
      if (this.uploadedFiles[0] != undefined) {
        for (var i = 0; i < this.uploadedFiles.length; i++) {
          formData.append("file", this.uploadedFiles[i], this.uploadedFiles[i].name);
          asyncResult = await this.http.post(environment.apiURl+'uploadImage', formData).toPromise()
          console.log(asyncResult["msg"]);

          this.userService.InsertUser(this.nombre, this.usuario, this.email, this.password, asyncResult["msg"])
            .subscribe((res: any) => {
              console.log(res);
              if (res['error']) {
                alert(res['msg']);
              } else {
                alert("Usuario Ingresado correctamente!");
                this.nombre = "";
                this.usuario = "";
                this.password = "";
                this.confirmarPassword = "";
                this.email = "";
                this.imgURL = "https://t4.ftcdn.net/jpg/01/19/32/93/240_F_119329387_sUTbUdeyhk0nuhNw5WaFvOyQFmxeppjX.jpg";
              }

            })
        }
      } else {

        this.userService.uploadWebImage(this.webcamImage.imageAsBase64)
          .subscribe((res: any) => {
            asyncResult = res;
            console.log(asyncResult["msg"]);

            this.userService.InsertUser(this.nombre, this.usuario, this.email, this.password, asyncResult["msg"])
              .subscribe((res: any) => {
                console.log(res);
                if (res['error']) {
                  alert(res['msg']);
                } else {
                  alert("Usuario Ingresado correctamente!");
                  this.nombre = "";
                  this.usuario = "";
                  this.password = "";
                  this.confirmarPassword = "";
                  this.email = "";
                  this.imgURL = "https://t4.ftcdn.net/jpg/01/19/32/93/240_F_119329387_sUTbUdeyhk0nuhNw5WaFvOyQFmxeppjX.jpg";
                }

              })
          })
      }



    } else {
      alert("Debes seleccionar una foto de perfil");
    }

  }

  addImage(element: any) {

    this.uploadedFiles = element.target.files; // outputs the first file
    console.log(element.target.files)
    if (element.length === 0)
      return;

    var mimeType = element.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      alert(this.message);
      return;
    }

    var reader = new FileReader();
    this.imagePath = element.target.files;
    reader.readAsDataURL(element.target.files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }

  }
  async upload() {
    var retorno;
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    var asyncResult = await this.http.post('http://localhost:3000/uploadImage', formData).toPromise()
    /*.subscribe((response) => {
         console.log('response received is ', response);
         retorno= response;
         return retorno;
    })*/
    console.log('response received is ', asyncResult);

  }
  gotoLogin() {
    this.router.navigate(['/login']);
  }

  public triggerSnapshot(): void {
    this.trigger.next();
    console.log(this.webcamImage)
    this.imgURL = this.webcamImage.imageAsDataUrl

  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

}
