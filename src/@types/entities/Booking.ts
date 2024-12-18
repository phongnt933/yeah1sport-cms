export interface IBooking {
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  date: string;
  userDetails: {
    name: string;
    phone: string;
  };
  fieldDetails: {
    name: string;
  };
}
