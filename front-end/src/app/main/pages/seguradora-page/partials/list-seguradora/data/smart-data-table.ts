// Smart DataTable
export var settings = {
  columns: {
    name: {
      title: 'Seguradora',
    },
    telephone: {
      title: 'Telefone Filial',
    },
    managerName: {
      title: 'Gerente Filial',
    },
    managerEmail: {
      title: 'Email Gerente',
    },
  },
  attr: {
    class: "table table-responsive"
  },
  edit:{
    editButtonContent: ''
  },
  delete:{
    deleteButtonContent: ''
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
    managerName: {
      title: 'Gerente Filial',
    },
    managerEmail: {
      title: 'Email Gerente',
    },
  },
  attr: {
    class: "table table-responsive"
  },
  edit:{
    editButtonContent: ''
  },
  delete:{
    deleteButtonContent: ''
  }
};

export var alertsettings = {

  actions: {
    add: false,
  },
  delete: {
    confirmDelete: true,
    deleteButtonContent: ''
  },
  add: {
    confirmCreate: true,
  },
  edit: {
    confirmSave: true,
    editButtonContent: '<i style="margin-right: 4px" class="ft-edit-2 info font-medium-1 mr-2"></i>',
    saveButtonContent: '<i style="margin-right: 4px" class="ft-save info font-medium-1 mr-2"></i>',
    cancelButtonContent: '<i style="margin-left: 4px" class="ft-x danger font-medium-1 mr-2"></i>'
  },
  columns: {
    name: {
      title: 'Seguradora',
    },
    telephone: {
      title: 'Telefone Filial',
    },
    managerName: {
      title: 'Gerente Filial',
    },
    managerEmail: {
      title: 'Email Gerente',
    },
  },
  attr: {
    class: "table table-responsive"
  },
};

export var alertdata = [];

export var filerdata = [];

export var data = [];
