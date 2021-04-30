export interface Reservation {
  id: number;
  userId: number;
  vehicleId: number;
  resBegin: Date;
  resEnd: Date;
  approved: boolean;
}
