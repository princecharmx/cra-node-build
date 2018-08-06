import React from 'react';
import { TableHeaderColumn, TableRow } from 'material-ui/Table';

export const MonthlyTableHeaderComponent = () => (
  // <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
  <TableRow displayBorder={false} style={{ backgroundColor: '#f9f9fb', textColor: 'Black' }}>
    <TableHeaderColumn
      // tooltip="Particulars"
      style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'left' }}
    >
      Date
    </TableHeaderColumn>
    <TableHeaderColumn
      // tooltip="Particulars"
      style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'left' }}
    >
      Account
    </TableHeaderColumn>
    <TableHeaderColumn
      // tooltip="Particulars"
      style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'left' }}
    >
      Voucher Type
    </TableHeaderColumn>
    <TableHeaderColumn
      // tooltip="Particulars"
      style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'left' }}
    >
      Invoice No
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
  </TableRow>
  // </TableHeader>
);
