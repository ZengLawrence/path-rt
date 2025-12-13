interface Train {
  headSign: string;
  arrivalTimeMessage: string;
}

export interface Station {
  name: string;
  trains: Train[];
}
