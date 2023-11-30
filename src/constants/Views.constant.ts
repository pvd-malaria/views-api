interface ViewMapping {
  // view-route: { ... }
  [key: string]: {
    name: string;
    description: string;
  };
}

export const Views: ViewMapping = {
  notif: {
    name: 'SerieHistNotif',
    description: 'Lorem ipsum',
  },
  raca: {
    name: 'SerieHistRaca',
    description: 'Lorem ipsum',
  },
  gender: {
    name: 'SerieHistGender',
    description: 'Lorem ipsum',
  },
  vivax: {
    name: 'SerieHistVivax',
    description: 'Lorem ipsum',
  },
  falciparum: {
    name: 'SerieHistFalciparum',
    description: 'Lorem ipsum',
  },
};
