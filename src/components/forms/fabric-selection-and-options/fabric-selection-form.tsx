'use client'

import { columns } from './columns'
import { DataTable } from './data-table'
import { useState } from 'react'
import { type FabricSelection } from '@/types/fabric'
import { Button } from '@/components/ui/button'

const initialData: FabricSelection[] = [
  {
    id: "1",
    copyPrevious: false,
    garmentId: "",
    brova: false,
    fabricSource: "",
    fabricCode: "",
    fabricLength: "",
    measurementId: "",
    customize: false,
    styleOptionId: "",
    style: "",
    line1: false,
    line2: false,
    collarType: "",
    collarButton: "",
    smallTabaggi: false,
    jabzour1: "",
    jabzour2: "",
    jabzour_thickness: "",
    top_pocket_type: "",
    top_pocket_thickness: "",
    pen_holder: false,
    side_pocket_phone: false,
    side_pocket_wallet: false,
    sleeves_type: "",
    sleeves_thickness: "",
    total_amount: 0,
    special_request: "",
  },
];

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
      garmentId: "",
      brova: false,
      fabricSource: "",
      fabricCode: "",
      fabricLength: "",
      measurementId: "",
      customize: false,
      styleOptionId: "",
      style: "",
      line1: false,
      line2: false,
      collarType: "",
      collarButton: "",
      smallTabaggi: false,
      jabzour1: "",
      jabzour2: "",
      jabzour_thickness: "",
      top_pocket_type: "",
      top_pocket_thickness: "",
      pen_holder: false,
      side_pocket_phone: false,
      side_pocket_wallet: false,
      sleeves_type: "",
      sleeves_thickness: "",
      total_amount: 0,
      special_request: "",
    };
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
