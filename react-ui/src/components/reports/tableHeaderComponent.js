import React from 'react';
import { TableHeaderColumn, TableRow } from 'material-ui/Table';

export const TableHeaderComponent = ({ title, showYearlyView }) => (
  <TableRow displayBorder={false} style={{ backgroundColor: '#f9f9fb', textColor: 'Black' }}>
    <TableHeaderColumn
      // tooltip="Particulars"
      style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'left' }}
    >
      {title}
    </TableHeaderColumn>
    <TableHeaderColumn
      // tooltip="Debit"
      style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'end' }}
    >
      Debit
    </TableHeaderColumn>
    <TableHeaderColumn
      // tooltip="Credit"
      style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'end' }}
    >
      Credit
    </TableHeaderColumn>
    {showYearlyView && (
      <TableHeaderColumn
        // tooltip="closing Balance"
        style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'end' }}
      >
        Closing Balance
      </TableHeaderColumn>
    )}
  </TableRow>
);
