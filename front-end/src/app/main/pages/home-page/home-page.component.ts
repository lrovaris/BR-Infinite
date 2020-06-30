import { Component, OnInit } from '@angular/core';
import { ColaboradorService} from "../../services/colaborador.service";
import { SeguradoraService} from "../../services/seguradora.service";
import { CorretoraService} from "../../services/corretora.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  mesSelected: any;

  aniversariantesDoMes = [];
  aniversariantesDoDia = [];

  producaoSeguradoras = [];

  seguradoras = [];
  corretoras = [];

  constructor(private colaboradorService: ColaboradorService, private seguradoraService: SeguradoraService, private corretoraService: CorretoraService) { }

  ngOnInit() {

    this.mesSelected = new Date().getMonth() + 1;

    this.seguradoraService.getAllSeguradoras().subscribe((data: any) => {
      this.seguradoras = data;
      // console.log(this.seguradoras);
      this.corretoraService.getAllCorretoras().subscribe((data: any) => {
        this.corretoras = data;
        // console.log(this.corretoras);

        this.selectNewMonth();

      });
    });


    this.seguradoraService.getProducaoHomePage().subscribe((data: any) => {
      this.producaoSeguradoras = data.report.report;
    })

  }


  FormataStringData(data) {
    let ano  = data.split("-")[0];
    let mes  = data.split("-")[1];
    let dia  = data.split("-")[2];

    if ((mes) && (dia)) {
      return dia + '/' + (mes)
    }

    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
  }

  IsDateToday(dateString){
    //Entrada de data precisa ser dia/mês, como retornado do método acima

    let dia = dateString.split('/')[0]

    let today = new Date().getDate()

    return (Number(dia) === Number(today));
  }

  selectNewMonth() {

    this.colaboradorService.getBirthDaysMonth(this.mesSelected).subscribe((data: any) => {
      console.log(data);

      this.aniversariantesDoMes = data;

      this.aniversariantesDoMes = this.aniversariantesDoMes.map(aniversariante => {
        aniversariante.birthday =  this.FormataStringData(aniversariante.birthday);
        return aniversariante;
      });

      this.aniversariantesDoMes = this.aniversariantesDoMes.map(aniversariante => {

        // console.log(aniversariante);

        let seg = this.seguradoras.find(seg_obj => aniversariante.seguradora.toString() === seg_obj._id.toString());
        let cor = this.corretoras.find(cor_obj => aniversariante.corretora.toString() === cor_obj._id.toString());

        // console.log(seg,cor);

        if (seg != undefined) {
          return {
            name: aniversariante.name,
            birthday: aniversariante.birthday,
            seguradora: seg.name
          }
        } else if (cor != undefined) {
          return {
            name: aniversariante.name,
            birthday: aniversariante.birthday,
            corretora: cor.name
          }
        } else {
          return
        }

      });

      this.aniversariantesDoDia = this.aniversariantesDoMes.filter(aniversariante => {
        return this.IsDateToday(aniversariante.birthday)
      })

      this.aniversariantesDoMes = this.aniversariantesDoMes.filter(aniversariante => {
        return !this.IsDateToday(aniversariante.birthday)
      })


    })
  }

}
