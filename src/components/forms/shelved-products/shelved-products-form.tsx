'use client'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { DataTable } from './data-table'
import type { ShelvedProduct, ShelvesFormValues } from './schema'
import { getShelves } from '@/api/shelves'
import { columns } from './shelves-columns'
import { toast } from 'sonner'
import { Plus, ArrowRight } from 'lucide-react'

interface ShelvedProductsFormProps {
  form: UseFormReturn<ShelvesFormValues>
  onProceed?: () => void
  isOrderClosed: boolean
}

export function ShelvedProductsForm({ form, onProceed, isOrderClosed }: ShelvedProductsFormProps) {
  // Fetch products from server
  const { data: serverProducts, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getShelves,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  // Initialize state with form values or empty array
  const [data, setData] = useState<ShelvedProduct[]>(
    form.getValues('products') || []
  )

  // Define new row template
  const newRow: ShelvedProduct = {
    id: '',
    serialNumber: '',
    productType: '',
    brand: '',
    quantity: 1,
    Stock: 0,
    unitPrice: 0,
  }

  // Get already selected product combinations (excluding current row)
  const getSelectedProducts = (currentRowIndex?: number) => {
    return data
      .filter((row, index) => index !== currentRowIndex && row.productType && row.brand)
      .map(row => `${row.productType}-${row.brand}`)
  }

  // Update form data whenever table data changes
  useEffect(() => {
    form.setValue('products', data, { shouldValidate: true })
  }, [data, form])

  const addRow = () => {
    setData([...data, { ...newRow, id: crypto.randomUUID() }])
  }

  const removeRow = (rowIndex: number) => {
    setData((old) => old.filter((_, index) => index !== rowIndex))
  }

  const updateData = (rowIndex: number, columnId: string, value: any) => {
    // Check for duplicate before updating state
    if (columnId === 'brand') {
      const currentRow = data[rowIndex]
      const selectedProducts = getSelectedProducts(rowIndex)
      const newCombination = `${currentRow.productType}-${value}`

      if (selectedProducts.includes(newCombination)) {
        toast.error('Product already selected', {
          description: 'This product is already added in another row.'
        })
        return // Don't proceed with update
      }

      // Check if selected product has stock
      const selectedProduct = serverProducts?.data?.find(
        (p: any) => p.fields?.Brand === value && p.fields?.Type === currentRow.productType
      )?.fields

      if (selectedProduct && (!selectedProduct.Stock || selectedProduct.Stock === 0)) {
        toast.error('No stock available', {
          description: 'This product is currently out of stock.'
        })
        return // Don't proceed with update
      }
    }

    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          // If brand is selected, find the matching product and update Stock and unitPrice
          if (columnId === 'brand') {

            const selectedProduct = serverProducts?.data?.find(
              (p: any) => p.fields?.Brand === value && p.fields?.Type === row.productType
            )?.fields


            const recordId = serverProducts?.data?.find(
              (p: any) => p.fields?.Brand === value && p.fields?.Type === row.productType
            )?.id!

            if (selectedProduct) {
              return {
                ...row,
                id: recordId,
                brand: value,
                Stock: selectedProduct.Stock || 0,
                unitPrice: selectedProduct.UnitPrice || 0,
                quantity: 1,
              }
            }
          }

          // If productType is selected, reset brand, stock, and price
          if (columnId === 'productType') {
            return {
              ...row,
              id: '',
              productType: value,
              brand: '',
              Stock: 0,
              unitPrice: 0,
              quantity: 1,
            }
          }

          return {
            ...row,
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  const totalAmount = data.reduce((acc, row) => acc + row.quantity * row.unitPrice, 0)

  if (isLoading) {
    return <div className='p-4'>Loading products...</div>
  }

  if (error) {
    return <div className='p-4 text-red-500'>Error loading products: {error.message}</div>
  }

  return (
    <div className="space-y-6 w-full">
      {/* Title Section */}
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            Shelved Products
          </h1>
          <p className="text-sm text-muted-foreground">Select products from inventory shelves</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
        <DataTable
          columns={columns}
          data={data}
          updateData={updateData}
          removeRow={removeRow}
          serverProducts={serverProducts?.data}
          selectedProducts={getSelectedProducts()}
          isOrderClosed={isOrderClosed}
        />

        <div className="flex justify-between items-center pt-4 border-t border-border">
          {!isOrderClosed && (
            <Button type="button" variant="outline" onClick={addRow}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          )}
          <div className="text-lg font-semibold">
            Total Amount: <span className="text-primary">{totalAmount.toFixed(2)} KWD</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isOrderClosed && (
        <div className="flex gap-4 justify-end">
          <Button type="button" onClick={onProceed}>
            Continue to Order & Payment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}