import { Component, OnInit } from '@angular/core';
import {ProdutoService} from "../../../../services/produto.service";
import domtoimage from 'dom-to-image';
import * as jsPDF from 'jspdf';
import { Router } from "@angular/router";

@Component({
  selector: 'app-produto-view',
  templateUrl: './produto-view.component.html',
  styleUrls: ['./produto-view.component.scss']
})
export class ProdutoViewComponent implements OnInit {

  produto: any;

  constructor(private produtoService: ProdutoService, private router: Router) { }

  ngOnInit() {
    this.produto = this.produtoService.getProduto();
  }

  navigateProdutos() {
    this.router.navigate(['produtos'])
  }
  navigateEdit() {
    this.produtoService.saveProductInfo(this.produto);
    this.produtoService.goingToEdit();
    this.router.navigate(['produtos/cadastro'])
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
