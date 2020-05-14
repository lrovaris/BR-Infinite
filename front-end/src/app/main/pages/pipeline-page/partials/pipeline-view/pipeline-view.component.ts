import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router} from "@angular/router";
import domtoimage from 'dom-to-image';
import * as jsPDF from 'jspdf';
import { PipelineService} from "../../../../services/pipeline.service";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pipeline-view',
  templateUrl: './pipeline-view.component.html',
  styleUrls: ['./pipeline-view.component.scss']
})
export class PipelineViewComponent implements OnInit {

  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;

  oportunidade: any;

  navigatePipeline() {
    this.router.navigate(['pipeline'])
  }

  download(file) {

    this.oportunidadeService.downloadFile(file.path).subscribe((data: any) => {
      console.log(file);
      saveAs(data, file.nome)
    })
  }

  constructor(private oportunidadeService: PipelineService, private router: Router) { }

  navigateEdit() {
    this.oportunidadeService.setIsEditTrue();
    this.router.navigate(['pipeline/cadastro'])
  }


  ngOnInit() {
    this.oportunidade = this.oportunidadeService.getOportunidadeWIthOutForm();
    console.log(this.oportunidade);
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

      });
  }

}
