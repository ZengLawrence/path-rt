export interface Station {
  name: string;
  trains: Array<{
    headSign: string;
    arrivalTimeMessage: string;
  }>;
}
