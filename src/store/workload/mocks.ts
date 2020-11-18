import {Entities} from 'components/workloadtable/enums';

export const projects = {
  headers: [
    {
      key: '234',
      type: 'type_expandable',
      entity: Entities.PROJECT,
      title: 'DEV - foobar',
      expandable: Entities.TASK,
      items: undefined,
    },
    {
      key: '235',
      entity: Entities.PROJECT,
      title: 'DEV - bartorgcomp.ru',
    }
  ],
  columns: {
    1583096400000: {
      234: {
        type: 'type_string',
        entity: Entities.PROJECT,
        title: '5/6 (12:55/48:00)',
        items: undefined,
      },
      235: {
        type: 'type_string',
        entity: Entities.PROJECT,
        title: '0/4 (00:00/12:00)',
      },
    },
    1583701200000: {
      234: {
        type: 'type_string',
        entity: Entities.PROJECT,
        title: '5/6 (12:55/48:00)',
      },
      235: {
        type: 'type_string',
        entity: Entities.PROJECT,
        title: '0/4 (00:00/12:00)',
      },
    },
  }
};

export const tasks = {
  headers: [
    {
      key: '19930',
      entity: Entities.TASK,
    },
    {
      key: '19931',
      entity: Entities.TASK,
    },
    {
      key: 'button',
      entity: Entities.TASK,
    },
  ],
  columns: {
    1583096400000: {
      19930: {
        type: 'type_task',
        entity: Entities.TASK,
        title: 'Карточка товара',
        link: 'https://portal.foobar.pro/company/personal/user/1/tasks/task/view/19930/',
        time: '04:05/08:00',
      },
      19931: {
        type: 'type_task',
        entity: Entities.TASK,
        title: 'Баг в форме обратной связи',
        link: 'https://portal.foobar.pro/company/personal/user/1/tasks/task/view/19931/',
        time: '00:50/02:00',
      },
      button: {
        type: 'type_task_button',
        entity: Entities.TASK,
        title: 'more',
      }
    },
    1583701200000: {
      19930: {
        type: 'type_task',
        entity: Entities.TASK,
        title: 'task name',
        link: 'https://portal.foobar.pro/company/personal/user/1/tasks/task/view/19931/',
        time: '00:50/02:00',
      },
    },
  }
}

export const content = {
  headers: [    
  ],
  columns: {  
  }
}

export const weeksBefore = {
  1582196142109: {
    heading: {
      type: 'type_heading',
      title: '10.02 - 14.02',
      index: 7,
    },
    33: {
      type: 'type_load',
      entity: Entities.USER,
      title: '100/122 (42:55/48:00)',
      deficiency: 85,
    },
    32: {
      type: 'type_load',
      entity: Entities.USER,
      title: '15/20 (2:55/24:00)',
      deficiency: 15,
      items: {
        234: {
          type: 'type_string',
          entity: Entities.PROJECT,
          title: '5/6 (12:55/48:00)',
          items: {
            19930: {
              type: 'type_task',
              entity: Entities.TASK,
              title: 'Карточка товара',
              link: 'https://portal.foobar.pro/company/personal/user/1/tasks/task/view/19930/',
              time: '04:05/08:00',
            },
            19931: {
              type: 'type_task',
              entity: Entities.TASK,
              title: 'Баг в форме обратной связи',
              link: 'https://portal.foobar.pro/company/personal/user/1/tasks/task/view/19931/',
              time: '00:50/02:00',
            },
            button: {
              type: 'type_task_button',
              entity: Entities.TASK,
              title: 'more',
            }
          },
        },
        235: {
          type: 'type_string',
          entity: Entities.PROJECT,
          title: '0/4 (00:00/12:00)',
        },
      }
    },
  },
  1582196142110: {
    heading: {
      type: 'type_heading',
      title: '17.02 - 21.02',
      index: 8,
    },
    33: {
      type: 'type_load',
      entity: Entities.USER,
      title: '1/122 (00:15/48:00)',
      deficiency: 5,
    },
    32: {
      type: 'type_load',
      entity: Entities.USER,
      title: '15/20 (2:55/24:00)',
      deficiency: 15,
      items: undefined,
    },
  },
  1582196142111: {
    heading: {
      type: 'type_heading',
      title: '24.02 - 1.03',
      index: 9,
    },
    33: {
      type: 'type_load',
      entity: Entities.USER,
      title: '1/122 (00:15/48:00)',
      deficiency: 5,
    },
  },
  1582196142112: {
    heading: {
      type: 'type_heading',
      title: '4.03 - 9.03',
      index: 10,
    },
    32: {
      type: 'type_load',
      entity: Entities.USER,
      title: '1/122 (00:15/48:00)',
      deficiency: 5,
    },
  },
  1582196142113: {
    heading: {
      type: 'type_heading',
      title: '12.03 - 16.03',
      index: 11,
    },
    33: {
      type: 'type_load',
      entity: Entities.USER,
      title: '1/122 (00:15/48:00)',
      deficiency: 5,
    },
  },
  1582196142114: {
    heading: {
      type: 'type_heading',
      title: '19.03 - 23.03',
      index: 12,
    },
    32: {
      type: 'type_load',
      entity: Entities.USER,
      title: '1/122 (00:15/48:00)',
      deficiency: 5,
    },
  },
  1582196142115: {
    heading: {
      type: 'type_heading',
      title: '26.03 - 30.03',
      index: 13,
    },
    32: {
      type: 'type_load',
      entity: Entities.USER,
      title: '1/122 (00:15/48:00)',
      deficiency: 5,
    },
  },
}

