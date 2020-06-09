import { Component, OnInit } from '@angular/core';
import { SeguradoraService } from "../../../../services/seguradora.service";
import {Router} from "@angular/router";
import {ProducaoService} from "../../../../services/producao.service";

@Component({
  selector: 'app-producao-enviar-anexo-partial',
  templateUrl: './producao-enviar-anexo-partial.component.html',
  styleUrls: ['./producao-enviar-anexo-partial.component.scss']
})
export class ProducaoEnviarAnexoPartialComponent implements OnInit {

  allSeguradoras = [];
  Files = [];
  filesToUpload: Array<File> = [];
  formData: any = new FormData();
  seguradora: any;

  data;


  FormataStringData(data) {
    let ano  = data.split("-")[0];
    let mes  = data.split("-")[1];
    let dia  = data.split("-")[2];

    if ((mes) && (dia)) {
      return dia + '/' + (mes) + '/' + (ano)
    } else {
      return ano;
    }

    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

  upload(event: any) {
    let newFile = event.target.files[0];
    this.filesToUpload.push(newFile);
  }

  removeFile(nome){
    let index = this.filesToUpload.indexOf(nome);
    if (index !== -1) this.filesToUpload.splice(index, 1);
  }

  constructor(private producaoService: ProducaoService, private router: Router, private seguradoraService: SeguradoraService) { }

  navigateBack() {
    this.router.navigate(['producao']);
  }

  log() {
    console.log(this.seguradora._id);
  }

  enviarAnexo(seguradoraId) {
    const files: Array<File> = this.filesToUpload;
    for(let i =0; i < files.length; i++) {
      this.formData.append('docs', files[i]);
    }
    this.producaoService.enviarAnexo(this.formData).subscribe((data: any) => {
      console.log(data);
      let producao = {
        path: data.info_files[0].path,
        seguradora: seguradoraId,
        date: this.data
      };
      this.producaoService.postProducao(producao).subscribe((data: any) => {
       alert(data.message);
      })
    })
  }

  ngOnInit() {
    this.seguradoraService.getAllSeguradoras().subscribe((data:any) => {
      this.allSeguradoras = data;
    });
  }

  saveDate(data) {
  this.data =  this.FormataStringData(data);

    console.log(this.data);
  }

}
