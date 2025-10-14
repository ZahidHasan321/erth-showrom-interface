'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { type ShelvedProduct } from './schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2 } from 'lucide-react'

export const columns: ColumnDef<ShelvedProduct>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Serial Number',
    minSize: 80,
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: 'productType',
    header: 'Product Type',
    minSize: 150,
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
    minSize: 150,
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
    minSize: 150,
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
    minSize: 120,
    cell: ({ row, table }) => {
        const { updateData } = table.options.meta as any
        return (
            <Input
                type="number"
                value={row.original.unitPrice}
                onChange={(e) => updateData(row.index, 'unitPrice', parseFloat(e.target.value))}
                placeholder='0.00'
            />
        )
    }
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    minSize: 120,
        cell: ({ row }) => {
          const total = row.original.quantity * row.original.unitPrice
          return <div className="border rounded-md p-2"><span>{total.toFixed(2)}</span></div>
        },
      },
  {
    id: 'actions',
    minSize: 80,
    cell: ({ row, table }) => {
      const { removeRow } = table.options.meta as any
      return (
        <Button variant="ghost" onClick={() => removeRow(row.index)}>
          <Trash2 color='red'/>
        </Button>
      )
    },
  },
]
