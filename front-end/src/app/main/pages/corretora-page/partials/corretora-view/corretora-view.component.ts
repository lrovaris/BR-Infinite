import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CorretoraService} from "../../../../services/corretora.service";
import {SeguradoraService} from "../../../../services/seguradora.service";
import {Router} from "@angular/router";
import {ColaboradorService} from "../../../../services/colaborador.service";
import domtoimage from 'dom-to-image';
import * as jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-corretora-view',
  templateUrl: './corretora-view.component.html',
  styleUrls: ['./corretora-view.component.scss']
})
export class CorretoraViewComponent implements OnInit {

  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;

  checkTelefones = false;
  checkColaboradores = false;
  corretora: any;
  seguradorasTable = [];
  seguradoras = [];

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

  navigateCorretora() {
    this.router.navigate(['corretora'])
  }

  constructor(
    private corretoraService: CorretoraService,
    private router: Router,
    private colaboradorService: ColaboradorService,
    private seguradoraService: SeguradoraService
  ) { }

  navigateEdit() {
    this.router.navigate(['corretora/cadastro'])
  }


  download(file) {

    this.corretoraService.downloadFile(file.path).subscribe((data: any) => {
      console.log(file);
      saveAs(data, file.nome)
    })
  }

  ngOnInit() {
    this.corretora = this.corretoraService.getcorretoraInfoWithOutFormGroup();
    console.log(this.corretora);

    this.seguradoraService.getAllSeguradoras().subscribe((seg_data:any) => {
      this.seguradoras = seg_data;

        this.seguradorasTable = this.corretora.seguradoras.map(corr_seg => {

          let seg = this.seguradoras.find(seg_data => corr_seg.toString() === seg_data._id.toString());

          return {
            name: seg.name,
            _id: seg._id,
            telephone: seg.telephone,
            email: seg.email
          }
        });

    });

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


  downloadCSV() {
    this.corretoraService.downloadCsv(this.corretora._id).subscribe((data: any) => {
    saveAs(data, `${this.corretora.name}-report.csv`);
      console.log(data);
    })
  }

}
