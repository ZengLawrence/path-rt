interface Train {
  headSign: string;
  arrivalTimeMessage: string;
}

export interface Station {
  key: string;
  name: string;
  trains: Train[];
}
