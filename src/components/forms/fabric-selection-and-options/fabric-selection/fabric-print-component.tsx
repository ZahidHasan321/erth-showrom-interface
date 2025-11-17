import React from 'react';

interface FabricLabelProps {
  fabricData: {
    orderId: string;
    customerId: string;
    customerName: string;
    garmentId: string;
    fabricSource: string;
    fabricLength: string;
    measurementId: string;
    brova: boolean;
    express: boolean;
    deliveryDate: Date | null;
  };
}

export const FabricLabel = React.forwardRef<HTMLDivElement, FabricLabelProps>(
  ({ fabricData }, ref) => {
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
          {/* Header */}
          <div style={{
            textAlign: 'center',
            padding: '8px 0',
            borderBottom: '2px solid black',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            Fabric Information
          </div>

          {/* Order ID */}
          <div style={{
            textAlign: 'center',
            padding: '10px 4px',
            borderBottom: '2px solid black',
            fontSize: '22px',
            fontWeight: 'bold'
          }}>
            Order ID: {fabricData.orderId}
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
            gridTemplateColumns: '1fr 1fr 1fr',
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
              padding: '8px 4px',
              borderRight: '1px solid #ccc'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Source</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{fabricData.fabricSource || 'N/A'}</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '8px 4px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Length</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{fabricData.fabricLength || 'N/A'}m</div>
            </div>
          </div>

          {/* Measurement Details Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            borderBottom: '2px solid black'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '8px 4px',
              borderRight: '1px solid #ccc'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Measurement ID</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{fabricData.measurementId}</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '8px 4px',
              borderRight: '1px solid #ccc'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Brova</div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{fabricData.brova ? 'Yes' : 'No'}</div>
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