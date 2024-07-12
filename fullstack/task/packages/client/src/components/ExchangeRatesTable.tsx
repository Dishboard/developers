import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { FC, Suspense } from 'react'
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import { ExchangeRate } from 'interfaces';

type ExchangeRatesTableProps = {
  exchangeRates: ExchangeRate[];
}

const columnHelper = createColumnHelper<ExchangeRate>()
const columns = [
  columnHelper.accessor(row => row.country, {
    id: 'country',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Country</span>,
  }),
  columnHelper.accessor('currency', {
    header: () => 'Age',
    cell: info => (info.renderValue() as string).charAt(0).toUpperCase() + info.renderValue()?.slice(1),
  }),
  columnHelper.accessor('rate', {
    header: () => <span>Rate</span>,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
  }),
  columnHelper.accessor('currencyCode', {
    header: 'Currency code',
  }),
]

const ExchangeRatesTable: FC<ExchangeRatesTableProps> = ({ exchangeRates }) => {
  const table = useReactTable({ columns, data: exchangeRates, getCoreRowModel: getCoreRowModel() })

  return (
    <div className='p-10'>
    <table className="table table-zebra">
      <Suspense fallback={<span className="loading loading-bars loading-lg"></span>}>
        <TableHeader headerGroups={table.getHeaderGroups()} />
        <TableBody getRowModel={table.getRowModel} />
    </Suspense>
      </table >
    </div>
  )
}

export default ExchangeRatesTable