import { flexRender, HeaderGroup } from "@tanstack/react-table"
import { ExchangeRate } from "interfaces"
import { FC } from "react"

type TableHeaderProps = {
  headerGroups: HeaderGroup<ExchangeRate>[]
}

const TableHeader: FC<TableHeaderProps> = ({ headerGroups }) => {
  return (
    <thead className="w-full">
      {headerGroups.map(headerGroup => (
        <tr key={headerGroup.id} className="w-full">
          {headerGroup.headers.map(header => (
            <th key={header.id} className="w-[20%]">
              {header.isPlaceholder
                ? null
                : flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}

export default TableHeader