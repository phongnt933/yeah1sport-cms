export interface IField {
  name: string;
  specificAddress: string;
  ward: string;
  district: string;
  province: string;
  phone: string;
  type: string;
  capacity: number;
  price: number;
  equipments: {
    name: string;
    price: number;
  };
  owner: {
    id: string;
    name: string;
  };
  id: string;
  createdAt: string;
  updatedAt: string;
}
