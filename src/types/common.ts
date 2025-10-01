export type Pagination = {
  page: number
  per_page: number
  total: number
}

export type PaginatedResponse<T> = {
  message: string
  status: string
  data: T[]
  pagination: Pagination
}
