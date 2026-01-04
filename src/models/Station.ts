export interface Train {
  headSign: string;
  arrivalTimeMessage: string;
  target: string;
  lineColors: string[];
}

export interface Station {
  key: string;
  name: string;
  trains: Train[];
}
