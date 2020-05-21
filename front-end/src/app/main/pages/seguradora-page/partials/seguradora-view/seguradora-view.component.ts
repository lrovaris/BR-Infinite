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

  seguradora: any;


  navigateSeguradora() {
    this.router.navigate(['seguradora'])
  }

  constructor(private seguradoraService: SeguradoraService, private router: Router) { }

  navigateEdit() {
    this.seguradoraService.editSeguradora(this.seguradora)
  }


  ngOnInit() {
    this.seguradora = this.seguradoraService.getseguradoraInfoWithOutFormGroup();
  }
  downloadPDF() {
    let node = document.getElementById('parentdiv');
    let img;
    let filename;
    let newImage;
    domtoimage.toPng(node, { bgcolor: '#fff' })
      .then(function(dataUrl) {
        img = new Image();
        img.src = dataUrl;
        newImage = img.src;
        img.onload = function(){
          let pdfWidth = img.width;
          let pdfHeight = img.height;
          // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image
          let doc;
          if (pdfWidth > pdfHeight)
          {
            doc = new jsPDF('l', 'px', [pdfWidth , pdfHeight]);
          } else {
            doc = new jsPDF('p', 'px', [pdfWidth , pdfHeight]);
          }
          let width = doc.internal.pageSize.getWidth();
          let height = doc.internal.pageSize.getHeight();
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
