export const adminSidenavLinks = [
  {
    id: 'section1',
    title: 'Home',
    childrens: [
      {
        id: 'child1',
        title: 'Dashboard',
        link: '/admin/dashboard',
        icon: 'mynaui:home',
      },
      {
        id: 'child2',
        title: 'Analytics',
        link: '/admin/analytics',
        icon: 'tabler:chart-bar',
      },
    ],
  },
  {
    id: 'section2',
    title: 'Evaluator',
    childrens: [
      {
        id: 'child4.1',
        title: 'Incident Management',
        link: '/admin/incident-management',
        icon: 'iconoir:laptop-fix',
      },
    ],
  },
  {
    id: 'section3',
    title: 'QR Code',
    childrens: [
      {
        id: 'child8',
        title: 'Location Management',
        link: '/admin/location-management',
        icon: 'fluent:location-settings-48-regular',
      },
      {
        id: 'child9',
        title: 'QR Code Template',
        link: '/admin/location-template',
        icon: 'tabler:template',
      },
    ],
  },
  {
    id: 'footer',
    title: '',
    type: 'footer',
    childrens: [
      {
        id: 'child12',
        title: 'Logout',
        link: '/logout',
        icon: 'material-symbols:logout',
      },
    ],
  },
];

export const evaluatorSidenavLinks = [
  {
    id: 'section2',
    title: 'Evaluator',
    childrens: [
      {
        id: 'child1',
        title: 'Dashboard',
        link: '/evaluator/dashboard',
        icon: 'mynaui:home',
      },
      {
        id: 'child4.1',
        title: 'Incident Management',
        link: '/evaluator/incident-management',
        icon: 'iconoir:laptop-fix',
      },
    ],
  },

  {
    id: 'footer',
    title: '',
    type: 'footer',
    childrens: [
      {
        id: 'child12',
        title: 'Logout',
        link: '/logout',
        icon: 'material-symbols:logout',
      },
    ],
  },
];

export const operatorSidenavLink = [
  {
    id: 'section1',
    title: 'Operator',
    childrens: [
      {
        id: 'child1',
        title: 'Dashboard',
        link: '/operator/dashboard',
        icon: 'mynaui:home',
      },
      {
        id: 'child1',
        title: 'Incident Management',
        link: '/operator/incident-management',
        icon: 'iconoir:laptop-fix',
      },
    ],
  },
  {
    id: 'footer',
    title: '',
    type: 'footer',
    childrens: [
      {
        id: 'child12',
        title: 'Logout',
        link: '/logout',
        icon: 'material-symbols:logout',
      },
    ],
  },
];

export const initiatorSidenavLink = [
  {
    id: 'section1',
    title: 'Home',
    childrens: [
      {
        id: 'child1',
        title: 'Initiate History',
        link: '/initiator/initiate-history',
        icon: 'material-symbols:history',
      },
    ],
  },

  {
    id: 'footer',
    title: '',
    type: 'footer',
    childrens: [
      {
        id: 'child12',
        title: 'Logout',
        link: '/logout',
        icon: 'material-symbols:logout',
      },
    ],
  },
];
