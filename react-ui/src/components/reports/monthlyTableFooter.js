import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';

export const MonthlyTableFooterComponent = ({ accountList, showYearlyView }) => (
  <React.Fragment>
    <TableRow displayBorder={false}>
      <TableRowColumn style={{ textAlign: 'left' }}>Opening Balance: </TableRowColumn>
      <TableRowColumn colSpan={2} style={{ fontWeight: 'bold', textAlign: 'left' }}>
        {parseFloat(accountList.openingBalance).toFixed(3)}
      </TableRowColumn>
      <TableRowColumn style={{ textAlign: 'end' }}>Total:</TableRowColumn>
      <TableRowColumn style={{ fontWeight: 'bold', textAlign: 'end' }}>
        {parseFloat(accountList.totalCredit).toFixed(3)}
      </TableRowColumn>
      <TableRowColumn style={{ fontWeight: 'bold', textAlign: 'end' }}>
        {parseFloat(accountList.totalDebit).toFixed(3)}
      </TableRowColumn>
    </TableRow>
    <TableRow displayBorder={false}>
      <TableRowColumn colSpan={5} style={{ textAlign: 'left' }}>
        Closing Balance
      </TableRowColumn>
      <TableRowColumn style={{ fontWeight: 'bold', textAlign: 'end' }}>
        Rs. {parseFloat(accountList.closingBalance).toFixed(3)}
      </TableRowColumn>
    </TableRow>
  </React.Fragment>
);
