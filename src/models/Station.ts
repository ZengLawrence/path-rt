interface Train {
  headSign: string;
  arrivalTimeMessage: string;
  target: string;
}

export interface Station {
  key: string;
  name: string;
  trains: Train[];
}
