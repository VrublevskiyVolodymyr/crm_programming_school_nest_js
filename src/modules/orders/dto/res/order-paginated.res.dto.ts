import { BaseOrderDto } from '../req/base-order.dto';

export class OrderPaginatedList {
  total_items: number;
  total_pages: number;
  prev: number | null;
  next: number | null;
  items: BaseOrderDto[];
}
