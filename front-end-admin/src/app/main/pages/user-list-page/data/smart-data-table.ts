// Smart DataTable
export var settings = {

  columns: {

    name: {
      title: 'Nome Completo',
    },
    login: {
      title: 'Usuário',
    },
    active: {
      title: 'Ativo',
      filter: {
        type: 'checkbox',
        config: {
          true: 'ativo',
          false: 'desativado',
        },
      },
    }
  },
  attr: {
    class: "table table-responsive"
  },
  edit:{
    editButtonContent: ''
  },
  delete:{
    deleteButtonContent: '<i class="icon-user-follow danger font-medium-1 mr-2"></i>'
  }
};

export var filtersettings = {
  actions: {
    add: false,
  },
  columns: {
    name: {
      title: 'Full Name',
      filter: {
        type: 'list',
        config: {
          selectText: 'Select...',
          list: [],
        },
      },
    },
    active: {
      title: 'Passed',
      filter: {
        type: 'checkbox',
        config: {
          true: 'Yes',
          false: 'No',
          resetText: 'clear',
        },
      },
    },
  },
  attr: {
    class: "table table-responsive"
  },
  edit:{
    editButtonContent: ''
  },
  delete:{
    deleteButtonContent: '<i class="ft-x danger font-medium-1 mr-2"></i>'
  }
};

export var alertsettings = {
  actions: {
    add: false,
  },
  delete: {
    confirmDelete: true,
    deleteButtonContent: '<i style="margin-left: 4px" class="ft-x danger font-medium-1 mr-2"></i>'
  },
  add: {
    confirmCreate: true,
  },
  edit: {
    confirmSave: true,
    editButtonContent: '<i style="margin-right: 4px" class="ft-edit-2 info font-medium-1 mr-2"></i>'
  },
  columns: {
    name: {
      title: 'Nome Completo',
    },
    login: {
      title: 'Usuário',
    },
    active: {
      title: 'Desativados',
      filter: {
        type: 'list',
        config: {
          selectText: 'Selecione',
          list: [
            { value: 'false', title: 'Desativado' },
            { value: 'true', title: 'Ativado' },
          ],
        }
      },
    },
  },
  attr: {
    class: "table table-responsive"
  },
};

export var alertdata = [];

export var filerdata = [];

export var data = [];
