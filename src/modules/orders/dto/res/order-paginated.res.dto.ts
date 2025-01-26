import { BaseOrderDto } from '../req/base-order.dto';

export class OrderPaginatedList {
  totalItems: number;
  totalPages: number;
  prev: number | null;
  next: number | null;
  items: BaseOrderDto[];
}
