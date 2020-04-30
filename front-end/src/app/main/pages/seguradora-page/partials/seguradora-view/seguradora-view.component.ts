import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import domtoimage from 'dom-to-image';
import * as jsPDF from 'jspdf';
import {SeguradoraService} from "../../../../services/seguradora.service";
import {Router} from "@angular/router";
import {delay} from "rxjs/operators";
import {ColaboradorService} from "../../../../services/colaborador.service";

@Component({
  selector: 'app-seguradora-view',
  templateUrl: './seguradora-view.component.html',
  styleUrls: ['./seguradora-view.component.scss']
})
export class SeguradoraViewComponent implements OnInit {

  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;

  checkTelefones = false;
  checkColaboradores = false;
  seguradora: any;

  setTelefonesTrue() {
   return this.checkTelefones = true;
  }
  setTelefonesFalse() {
  return  this.checkTelefones = false;
  }
  setColaboradoresTrue() {
   return this.checkColaboradores = true;
  }
  setColaboradoresFalse() {
  return  this.checkColaboradores = false;
  }

  navigateSeguradora() {
    this.router.navigate(['seguradora'])
  }

  constructor(private seguradoraService: SeguradoraService, private router: Router, private colaboradorService: ColaboradorService) { }

  navigateEdit() {
    this.router.navigate(['seguradora/cadastro'])
  }
  navigateColaborador() {
    this.colaboradorService.setCameFromSeguradoraTrue();
    this.colaboradorService.setWorkId(this.seguradora._id);
    this.router.navigate(['colaborador'])
  }

  ngOnInit() {
    this.seguradora = this.seguradoraService.getseguradoraInfoWithOutFormGroup();
    console.log(this.seguradora);
  }

   async downloadPDFCompleto()
  {
  await  this.setColaboradoresTrue();
  await  this.setTelefonesTrue();
    setTimeout(this.downloadPDF, 0)
  }
 async downloadPDFReduzido()
  {
  await this.setTelefonesFalse();
  await this.setColaboradoresFalse();
    setTimeout(this.downloadPDF, 0)
  }

  downloadPDF() {
    var node = document.getElementById('parentdiv');
    var img;
    var filename;
    var newImage;
    domtoimage.toPng(node, { bgcolor: '#fff' })
      .then(function(dataUrl) {
        img = new Image();
        img.src = dataUrl;
        newImage = img.src;
        img.onload = function(){
          var pdfWidth = img.width;
          var pdfHeight = img.height;
          // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image
          var doc;
          if (pdfWidth > pdfHeight)
          {
            doc = new jsPDF('l', 'px', [pdfWidth , pdfHeight]);
          } else {
            doc = new jsPDF('p', 'px', [pdfWidth , pdfHeight]);
          }
          var width = doc.internal.pageSize.getWidth();
          var height = doc.internal.pageSize.getHeight();
          doc.addImage(newImage, 'PNG',  10, 10, width, height);
          filename = 'mypdf_' + '.pdf';
          doc.save(filename);
        };
      })
      .catch(function(error) {
        // Error Handling
      });
  }

}
