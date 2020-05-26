import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  createYearsObjectFromProduction(thisProduction) {
    let yearsObject = {};

    for (let i = 0; i < thisProduction.length; i++) {

      let currentDate = this.getDateInfoFromString(thisProduction[i].date);
      let prod_id = thisProduction[i]._id

      yearsObject = this.makeDateObject(currentDate, prod_id, yearsObject);

    }

   return yearsObject;
  }

  getDateInfoFromString(date) {
    return {
      day: date.split("/")[0],
      month: date.split("/")[1],
      year: date.split("/")[2]
    }
  }

  getDateStringFromInfo (info){
    return `${info.day}/${info.month}/${info.year}`
  }

  isTheNewDateBigger(oldDate, newDate) {

    let dataNew = this.getDateInfoFromString(newDate);

    let dataOld = this.getDateInfoFromString(oldDate);

    if (dataNew.year < dataOld.year) {

      return false // ANO DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

    } else if ( (dataNew.year >= dataOld.year) ) {

      if (dataNew.month < dataOld.month) {

        return false  // MES DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

      } else if ( dataNew.month >= dataOld.month) {

        if (dataNew.day < dataOld.day) {

          return false   // DIA DO NOVO DOCUMENTO É MENOR QUE O DOCUMENTO NO ARRAY LOGO NAO É A ULTIMA DATA

        } else if ( dataNew.day > dataOld.day ) {

          return true

        }

        if (dataNew.month > dataOld.month) {
          return true
        }

      }

      return dataNew.year > dataOld.year;
    }

  }

  makeDateObject(new_data, productionId, yearsObj) {
    let yearsArray = Object.entries(yearsObj);

    if(yearsArray.length === 0){

      yearsObj[new_data.year] = {}
      yearsObj[new_data.year][new_data.month] = {}
      yearsObj[new_data.year][new_data.month][new_data.day] = productionId

    }else {

      let currentYearObj = yearsArray.find(year_obj => year_obj[0] === new_data.year)

      if(currentYearObj !== undefined){

        let monthsArray = Object.entries(currentYearObj[1]);

        if(monthsArray.length === 0){

          yearsObj[new_data.year][new_data.month] = {}
          yearsObj[new_data.year][new_data.month][new_data.day] = productionId

        }else {

          let currentMonthObj = monthsArray.find(month_obj => month_obj[0] === new_data.month)

          if(currentMonthObj !== undefined){

            let daysArray = Object.entries(currentMonthObj[1]);

            if (daysArray.length === 0) {
              yearsObj[new_data.year][new_data.month][new_data.day] = productionId;
            }

            else if(!daysArray.includes(new_data.day)){

              yearsObj[new_data.year][new_data.month][new_data.day] = productionId;

            }

          }else {
            yearsObj[new_data.year][new_data.month] = {}
            yearsObj[new_data.year][new_data.month][new_data.day] = productionId;
          }
        }
      }
      else{
        yearsObj[new_data.year] = {}
        yearsObj[new_data.year][new_data.month] = {}
        yearsObj[new_data.year][new_data.month][new_data.day] = productionId
      }
    }

    return yearsObj;
  }

  doesDateExist(date, yearsObj){
    let data_obj = this.getDateInfoFromString(date);

    if(!yearsObj[data_obj.year]){
      return {
        exists: false
      };
    }

    if(!yearsObj[data_obj.year][data_obj.month]){
      return {
        exists: false
      };
    }

    if(yearsObj[data_obj.year][data_obj.month][data_obj.day] === undefined){
      return {
        exists: false
      };
    }

    return {
      exists: true,
      prod_id: yearsObj[data_obj.year][data_obj.month][data_obj.day]
    }
  }
}
