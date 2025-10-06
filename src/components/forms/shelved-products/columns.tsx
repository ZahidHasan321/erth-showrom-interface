'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { type ShelvedProduct } from './schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const columns: ColumnDef<ShelvedProduct>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Serial Number',
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: 'productType',
    header: 'Product Type',
    cell: ({ row, table }) => {
        const { updateData } = table.options.meta as any
        return (
            <Select
                value={row.original.productType}
                onValueChange={(value) => updateData(row.index, 'productType', value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Product Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="shirt">Shirt</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                </SelectContent>
            </Select>
        )
    }
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    cell: ({ row, table }) => {
        const { updateData } = table.options.meta as any
        return (
            <Select
                value={row.original.brand}
                onValueChange={(value) => updateData(row.index, 'brand', value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="brand-a">Brand A</SelectItem>
                    <SelectItem value="brand-b">Brand B</SelectItem>
                    <SelectItem value="brand-c">Brand C</SelectItem>
                </SelectContent>
            </Select>
        )
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row, table }) => {
      const { updateData } = table.options.meta as any
      const quantity = row.original.quantity

      const handleIncrement = () => {
        updateData(row.index, 'quantity', quantity + 1)
      }

      const handleDecrement = () => {
        if (quantity > 1) {
          updateData(row.index, 'quantity', quantity - 1)
        }
      }

      return (
        <div className="flex items-center gap-2">
          <Button size="icon" onClick={handleDecrement}>-</Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => updateData(row.index, 'quantity', parseInt(e.target.value))}
            className="w-16 text-center"
          />
          <Button size="icon" onClick={handleIncrement}>+</Button>
        </div>
      )
    },
  },
  {
    accessorKey: 'unitPrice',
    header: 'Unit Price',
    cell: ({ row, table }) => {
        const { updateData } = table.options.meta as any
        return (
            <Input
                type="number"
                value={row.original.unitPrice}
                onChange={(e) => updateData(row.index, 'unitPrice', parseFloat(e.target.value))}
            />
        )
    }
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ row }) => {
      const total = row.original.quantity * row.original.unitPrice
      return <span>{total.toFixed(2)}</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const { removeRow } = table.options.meta as any
      return (
        <Button variant="ghost" onClick={() => removeRow(row.index)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </Button>
      )
    },
  },
]
