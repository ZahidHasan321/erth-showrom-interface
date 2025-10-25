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
        const { updateData, serverProducts } = table.options.meta as any
        
        // Get unique product types from server data
        const productTypes: string[] = Array.from(
          new Set(serverProducts?.map((p: any) => p.fields?.Type).filter(Boolean) || [])
        )
        
        return (
            <Select
                value={row.original.productType}
                onValueChange={(value) => updateData(row.index, 'productType', value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Product Type" />
                </SelectTrigger>
                <SelectContent>
                    {productTypes.map((type: string, idx: number) => (
                        <SelectItem key={`type-${idx}-${type}`} value={type}>
                            {type}
                        </SelectItem>
                    ))}
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
        const { updateData, serverProducts, selectedProducts } = table.options.meta as any
        
        // Filter brands based on selected product type
        const selectedType = row.original.productType
        const brands: string[] = serverProducts
            ?.filter((p: any) => !selectedType || p.fields?.Type === selectedType)
            .map((p: any) => p.fields?.Brand)
            .filter(Boolean) || []
        const uniqueBrands: string[] = Array.from(new Set(brands))
        
        return (
            <Select
                value={row.original.brand}
                onValueChange={(value) => updateData(row.index, 'brand', value)}
                disabled={!selectedType}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                    {uniqueBrands.map((brand: string, idx: number) => {
                        const combination = `${selectedType}-${brand}`
                        const isAlreadySelected = selectedProducts?.includes(combination)
                        
                        // Check if product has stock
                        const product = serverProducts?.find(
                            (p: any) => p.fields?.Brand === brand && p.fields?.Type === selectedType
                        )
                        const hasStock = product?.fields?.Stock && product.fields.Stock > 0
                        
                        return (
                            <SelectItem 
                                key={`brand-${idx}-${brand}`} 
                                value={brand}
                                disabled={isAlreadySelected || !hasStock}
                            >
                                {brand} 
                                {isAlreadySelected && ' (Already selected)'}
                                {!hasStock && !isAlreadySelected && ' (Out of stock)'}
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>
        )
    }
  },
  {
    accessorKey: 'Stock',
    header: 'Available Stock',
    minSize: 100,
    cell: ({ row }) => {
      return <div className="border rounded-md p-2">{row.original.Stock || 0}</div>
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    minSize: 150,
    cell: ({ row, table }) => {
      const { updateData } = table.options.meta as any
      const quantity = row.original.quantity
      const maxStock = row.original.Stock || 0

      const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault()
        if (maxStock === 0) {
          return
        }
        if (quantity < maxStock) {
          updateData(row.index, 'quantity', quantity + 1)
        }
      }

      const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault()
        if (quantity > 1) {
          updateData(row.index, 'quantity', quantity - 1)
        }
      }

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        
        if (isNaN(value) || value < 1) {
          updateData(row.index, 'quantity', 1)
          return
        }
        
        if (maxStock === 0) {
          updateData(row.index, 'quantity', 1)
          return
        }
        
        if (value > maxStock) {
          updateData(row.index, 'quantity', maxStock)
          return
        }
        
        updateData(row.index, 'quantity', value)
      }

      const hasError = maxStock === 0 || quantity > maxStock

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button 
              type="button"
              size="icon" 
              onClick={handleDecrement} 
              disabled={quantity <= 1}
              variant="outline"
            >
              -
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={handleChange}
              className={`w-16 text-center ${hasError ? 'border-red-500' : ''}`}
              max={maxStock}
              min={1}
            />
            <Button 
              type="button"
              size="icon" 
              onClick={handleIncrement} 
              disabled={quantity >= maxStock || maxStock === 0}
              variant="outline"
            >
              +
            </Button>
          </div>
          {maxStock === 0 && (
            <span className="text-xs text-red-500 text-center">No stock available</span>
          )}
          {quantity > maxStock && maxStock > 0 && (
            <span className="text-xs text-red-500 text-center">Exceeds stock ({maxStock})</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'unitPrice',
    header: 'Unit Price',
    minSize: 120,
    cell: ({ row }) => {
        return (
            <div className="border rounded-md p-2">
                {row.original.unitPrice.toFixed(2)}
            </div>
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
        <Button type="button" variant="ghost" onClick={() => removeRow(row.index)}>
          <Trash2 className="h-4 w-4 text-red-500"/>
        </Button>
      )
    },
  },
]