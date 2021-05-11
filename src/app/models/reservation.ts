export interface Reservation {
  id: number;
  user: number;
  vehicle: number;
  resBegin: Date;
  resEnd: Date;
  approved: boolean;
}
