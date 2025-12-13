import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFabrics } from '@/api/fabrics';

interface FabricLabelProps {
  fabricData: {
    orderId: string;
    customerId: string;
    customerName: string;
    customerMobile: string;
    garmentId: string;
    fabricSource: string;
    fabricId: string;
    fabricLength: string;
    measurementId: string;
    brova: boolean;
    express: boolean;
    deliveryDate: Date | null;
  };
}

export const FabricLabel = React.forwardRef<HTMLDivElement, FabricLabelProps>(
  ({ fabricData }, ref) => {
    const { data: fabricsResponse } = useQuery({
      queryKey: ["fabrics"],
      queryFn: getFabrics,
      staleTime: Infinity,
      gcTime: Infinity,
    });

    const fabrics = fabricsResponse?.data || [];

    // Look up the fabric name if source is IN
    const fabricName = React.useMemo(() => {
      if (fabricData.fabricSource === 'IN' && fabricData.fabricId) {
        const fabric = fabrics.find(f => f.id === fabricData.fabricId);
        return fabric?.fields.Name || 'N/A';
      }
      return 'Out';
    }, [fabricData.fabricSource, fabricData.fabricId, fabrics]);

    const formatDate = (date: Date | string | null | undefined) => {
      if (!date) return "N/A";
      const d = new Date(date);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    return (
      <div
        ref={ref}
        className="bg-white text-black"
        style={{
          width: '450px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '18px',
          padding: '0',
          margin: '0 auto'
        }}
      >
        <div>
          {/* Header - Order ID and Customer Mobile */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '2px solid black'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '10px 4px',
              borderRight: '1px solid #ccc',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Order ID: {fabricData.orderId}
            </div>
            <div style={{
              textAlign: 'center',
              padding: '10px 4px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Mobile: {fabricData.customerMobile}
            </div>
          </div>

          {/* Customer Details Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '2px solid black'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '8px 4px',
              borderRight: '1px solid #ccc'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Customer ID</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{fabricData.customerId}</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '8px 4px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Customer Name</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{fabricData.customerName}</div>
            </div>
          </div>

          {/* Garment Details Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '2px solid black'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '8px 4px',
              borderRight: '1px solid #ccc'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Garment ID</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{fabricData.garmentId}</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '8px 4px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Source</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {fabricName}
              </div>
            </div>
          </div>

          {/* Measurement Details Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '2px solid black'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '8px 4px',
              borderRight: '1px solid #ccc'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Status</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{fabricData.brova ? 'Brova' : 'Final'}</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '8px 4px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Express Delivery</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{fabricData.express ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {/* Delivery Date */}
          <div style={{
            textAlign: 'center',
            padding: '8px 4px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            Delivery Date: {formatDate(fabricData.deliveryDate)}
          </div>
        </div>
      </div>
    );
  }
);