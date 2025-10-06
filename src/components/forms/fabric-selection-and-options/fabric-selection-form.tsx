'use client'

import { columns } from './columns'
import { DataTable } from './data-table'
import { type FabricSelection } from '@/types/fabric'
import { Button } from '@/components/ui/button'
import { createWorkOrderStore } from "@/store/current-work-order";
import { useQuery } from '@tanstack/react-query';
import { getMeasurementsByCustomerId } from '@/api/measurements';
import * as React from 'react';

interface FabricSelectionFormProps {
  useCurrentWorkOrderStore: ReturnType<typeof createWorkOrderStore>;
  customerId: string | null;
}

export function FabricSelectionForm({ useCurrentWorkOrderStore, customerId }: FabricSelectionFormProps) {
  const {
    fabricSelections,
    addFabricSelection,
    updateFabricSelection,
    removeFabricSelection,
  } = useCurrentWorkOrderStore();

  const { data: measurementQuery } = useQuery({
    queryKey: ["measurements", customerId],
    queryFn: () => {
      if (!customerId) {
        return Promise.resolve(null);
      }
      return getMeasurementsByCustomerId(customerId);
    },
    enabled: !!customerId,
  });

  const measurementIDs = React.useMemo(() => {
    if (measurementQuery?.data && measurementQuery.data.length > 0) {
      return measurementQuery.data.map((m) => m.fields.MeasurementID);
    }
    return [];
  }, [measurementQuery]);

  const updateData = (rowIndex: number, columnId: string, value: any) => {
    const updatedRow = { ...fabricSelections[rowIndex], [columnId]: value };
    updateFabricSelection(updatedRow);
  }

  const addRow = () => {
    const newRow: FabricSelection = {
      id: `${fabricSelections.length + 1}`,
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
    addFabricSelection(newRow);
  }

  const removeRow = (rowIndex: number) => {
    const idToRemove = fabricSelections[rowIndex].id;
    removeFabricSelection(idToRemove);
  }

  return (
    <div className='p-4 max-w-6xl overflow-x-auto'>
      <h2 className='text-2xl font-bold mb-4'>Fabric Selection and Options</h2>
      <DataTable columns={columns} data={fabricSelections} updateData={updateData} removeRow={removeRow} measurementIDs={measurementIDs} />
      <Button onClick={addRow} className='mt-4' disabled={measurementIDs.length === 0}>
        Add Lines
      </Button>
    </div>
  )
}
