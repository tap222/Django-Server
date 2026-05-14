export type ColumnType = 'default' | 'badge' | 'custom' | 'action' | 'view' | 'actionButton' | 'delete'

export interface ColumnMeta {
  imageKey?: string
  labelKey?: string
}

export interface ColumnDef {
  key: string
  label: string
  type?: ColumnType
  meta?: ColumnMeta
}

export interface DataTablePaginationProps {
  total: number
  page: number
  pageSize: number
}
