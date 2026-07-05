export interface IQueryOptions {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  filter?: Record<string, any>;
}
