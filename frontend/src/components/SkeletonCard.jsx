import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="glass-panel" style={{ height: '380px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton" style={{ height: '220px', width: '100%', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}></div>
      <div style={{ padding: 'var(--space-lg)', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div className="skeleton" style={{ height: '22px', width: '80%', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '60%', borderRadius: '4px' }}></div>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: '28px', width: '30%', borderRadius: '4px' }}></div>
          <div className="skeleton" style={{ height: '36px', width: '40%', borderRadius: 'var(--radius-md)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
