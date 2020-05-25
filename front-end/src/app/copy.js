

  this.seguradoraName = activeSeguradoraProductionsArray[i].seguradora.name;

  if (this.corretorasOfActiveSeguradora.length === 0) {

    this.corretorasOfActiveSeguradora.push(activeSeguradoraProductionsArray[i]);

  } else {

    let corretora = this.corretorasOfActiveSeguradora.find(cor => activeSeguradoraProductionsArray[i].corretora._id === cor.corretora._id);

    if (corretora === undefined) {

      this.corretorasOfActiveSeguradora.push(activeSeguradoraProductionsArray[i]);

    } else {

      if (this.isTheNewDateBigger(corretora.date, activeSeguradoraProductionsArray[i].date)) {

        this.arrayWithOldDatesProduction.push(corretora);

        let index = this.corretorasOfActiveSeguradora.indexOf(corretora);
        if (index !== -1) this.corretorasOfActiveSeguradora.splice(index, 1);
        this.corretorasOfActiveSeguradora.push(activeSeguradoraProductionsArray[i]);

      }

    }

  }

