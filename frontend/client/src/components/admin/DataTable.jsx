import React from 'react';

const DataTable = ({ columns, data, onEdit, onDelete, customActions = [] }) => {
  return (
    <div className="table-responsive" style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{ padding: '12px', color: '#7f8c8d', fontWeight: 'bold' }}>{col.header}</th>
            ))}
            {(onEdit || onDelete || customActions.length > 0) && <th style={{ padding: '12px', color: '#7f8c8d', fontWeight: 'bold', textAlign: 'center' }}>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete || customActions.length > 0 ? 1 : 0)} style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} style={{ borderBottom: '1px solid #ecf0f1' }}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{ padding: '12px', color: '#2c3e50' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                {(onEdit || onDelete || customActions.length > 0) && (
                  <td style={{ padding: '12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {customActions.map((action, idx) => (
                      <button key={idx} onClick={() => action.onClick(row)} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: action.color || '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {action.label}
                      </button>
                    ))}
                    {onEdit && (
                      <button onClick={() => onEdit(row)} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Sửa
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} style={{ padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Xóa
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
