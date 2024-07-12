import { flexRender, RowModel, Table } from "@tanstack/react-table"
import { ExchangeRate } from "interfaces"
import { FC } from "react"

type TableBodyProps = {
  getRowModel: () => RowModel<ExchangeRate>
}

const TableBody: FC<TableBodyProps> = ({
  getRowModel
}) => {
  return (
    <tbody>
      {getRowModel().rows.map(row => (
        <tr key={row.id} className="w-full">
          {row.getVisibleCells().map(cell => (
            <td key={cell.id} className='w-[20%]'>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export default TableBody