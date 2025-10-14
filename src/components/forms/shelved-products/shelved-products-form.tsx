'use client'

import { Button } from '@/components/ui/button'
import { columns } from './columns'
import { DataTable } from './data-table'
import { type ShelvedProduct } from './schema'
import React, { useEffect } from 'react'



interface ShelvedProductsFormProps {
  onProceed?: () => void;
  // data: ShelvedProduct[]
  setFormData: (data: ShelvedProduct[]) => void;
}


export function ShelvedProductsForm({ setFormData, onProceed }: ShelvedProductsFormProps) {
  const [data, setData] = React.useState<ShelvedProduct[]>([]);
  const updateData = (rowIndex: number, columnId: string, value: any) => {
    setData((old: ShelvedProduct[]) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  const addRow = () => {
    const newRow: ShelvedProduct = {
      id: `${data.length + 1}`,
      serialNumber: `${data.length + 1}`,
      productType: 'shirt',
      brand: 'brand-a',
      quantity: 1,
      unitPrice: 0,
    }
    setData([...data, newRow])
  }

  useEffect(() => {
    setFormData(data);
  }, [data, setFormData])

  const removeRow = (rowIndex: number) => {
    setData((old) => old.filter((_, index) => index !== rowIndex))
  }

  const totalAmount = data.reduce((acc, row) => acc + row.quantity * row.unitPrice, 0)

  return (
    <div className='p-4 max-w-7xl overflow-x-auto w-full bg-muted rounded-lg shadow'>
      <h2 className='text-2xl font-bold mb-4'>Shelves Products</h2>
        <DataTable columns={columns} data={data} updateData={updateData} removeRow={removeRow} />
      <div className="flex justify-between items-center mt-4">
        <Button onClick={addRow}>
          Add Item
        </Button>
        <div className="text-right flex flex-col gap-4 font-bold">
          Total Amount: {totalAmount.toFixed(2)}
          <Button onClick={onProceed}>
            proceed
          </Button>
        </div>
      </div>
    </div>
  )
}
