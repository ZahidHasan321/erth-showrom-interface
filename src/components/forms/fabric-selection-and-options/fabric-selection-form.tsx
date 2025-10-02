'use client'

import { columns } from './columns'
import { DataTable } from './data-table'
import { useState } from 'react'
import { type FabricSelection } from './columns'
import { Button } from '@/components/ui/button'

const initialData: FabricSelection[] = [
  {
    id: '1',
    copyPrevious: false,
    garmentId: '',
    brova: false,
    fabricSource: '',
    fabricCode: '',
    fabricLength: '',
    measurementId: '',
    customize: false,
    styleOptionId: '',
    style: '',
    line1: false,
    line2: false,
    collarType: '',
    collarButton: '',
    smallTabaggi: false,
  },
]

export function FabricSelectionForm() {
  const [data, setData] = useState<FabricSelection[]>(initialData)

  const updateData = (rowIndex: number, columnId: string, value: any) => {
    setData((old) =>
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
    const newRow: FabricSelection = {
      id: `${data.length + 1}`,
      copyPrevious: false,
      garmentId: '',
      brova: false,
      fabricSource: '',
      fabricCode: '',
      fabricLength: '',
      measurementId: '',
      customize: false,
      styleOptionId: '',
      style: '',
      line1: false,
      line2: false,
      collarType: '',
      collarButton: '',
      smallTabaggi: false,
    }
    setData([...data, newRow])
  }

  return (
    <div className='p-4 max-w-6xl overflow-x-auto'>
      <h2 className='text-2xl font-bold mb-4'>Fabric Selection and Options</h2>
      <DataTable columns={columns} data={data} updateData={updateData} />
      <Button onClick={addRow} className='mt-4'>
        Add Lines
      </Button>
    </div>
  )
}
