function getDateInfoFromString(date) {
  return {
    day: Number(date.split("/")[0].toString()),
    month: Number(date.split("/")[1].toString()),
    year: Number(date.split("/")[2].toString())
  }
}

function isTheNewDateBigger(oldDate, newDate) {

  let dataNew = getDateInfoFromString(newDate);

  let dataOld = getDateInfoFromString(oldDate);

  if (dataNew.year < dataOld.year) {
    return false
  } else if ( (dataNew.year >= dataOld.year) ) {
    if (dataNew.month < dataOld.month) {
      return false
    } else if ( dataNew.month >= dataOld.month) {
      if (dataNew.day < dataOld.day) {
        return false
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

function createYearsObjectFromProduction(productionArray) {
  let yearsObject = {};

  for (let i = 0; i < productionArray.length; i++) {

    let currentDate = getDateInfoFromString(productionArray[i].date);

    yearsObject = makeDateObject(currentDate, yearsObject);

  }

 return yearsObject;
}

function makeDateObject(new_data, yearsObj) {
  let yearsArray = Object.entries(yearsObj);

  if(yearsArray.length === 0){

    yearsObj[new_data.year] = {}
    yearsObj[new_data.year][new_data.month] = {}
    yearsObj[new_data.year][new_data.month] = [ new_data.day ]

  }else {

    let currentYearObj = yearsArray.find(year_obj => year_obj[0] === new_data.year.toString())

    if(currentYearObj !== undefined){

      let monthsArray = Object.entries(currentYearObj[1]);

      if(monthsArray.length === 0){

        yearsObj[new_data.year][new_data.month] = {}
        yearsObj[new_data.year][new_data.month] = [ new_data.day ]

      }else {

        let currentMonthObj = monthsArray.find(month_obj => month_obj[0] === new_data.month.toString())

        if(currentMonthObj !== undefined){

          let daysArray = currentMonthObj[1];

          if (daysArray.length === 0) {
            yearsObj[new_data.year][new_data.month] = [ new_data.day ];
          }

          else if(!daysArray.includes(new_data.day)){

            yearsObj[new_data.year][new_data.month].push(new_data.day);

          }

        }else {
          yearsObj[new_data.year][new_data.month] = {}
          yearsObj[new_data.year][new_data.month] = [ new_data.day ];
        }
      }
    }
    else{
      yearsObj[new_data.year] = {}
      yearsObj[new_data.year][new_data.month] = {}
      yearsObj[new_data.year][new_data.month] = [ new_data.day ]
    }
  }

  return yearsObj;
}

module.exports = {
  getDateInfoFromString,
  isTheNewDateBigger,
  createYearsObjectFromProduction,
  makeDateObject
};
