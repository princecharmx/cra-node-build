import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import _ from 'lodash';

export const YearlyBreakupComponent = ({ accountList, showMonthlyViewAction }) => {
  // <TableBody displayRowCheckbox={false} deselectOnClickaway={true}>
  //   {
  return (
    <React.Fragment>
      <TableRow displayBorder={false}>
        <TableRowColumn colSpan={3}>Opening Balance</TableRowColumn>
        <TableRowColumn style={{ textAlign: 'end', fontWeight: 'bold' }}>
          Rs. {accountList.openingBalance}
        </TableRowColumn>
      </TableRow>
      {_.map(accountList.months, item => (
        <React.Fragment>
          <TableRow
            displayBorder={false}
            key={item}
            onCellClick={() => {
              showMonthlyViewAction(item);
            }}
            style={{ cursor: 'pointer' }}
          >
            <TableRowColumn>{item.month.name}</TableRowColumn>
            <TableRowColumn style={{ textAlign: 'end' }}>
              Rs. {parseFloat(parseFloat(item.debit).toFixed(3))}
            </TableRowColumn>
            <TableRowColumn style={{ textAlign: 'end' }}>
              Rs. {parseFloat(parseFloat(item.credit).toFixed(3))}
            </TableRowColumn>
            <TableRowColumn style={{ textAlign: 'end' }}>
              Rs. {parseFloat(parseFloat(item.closingBalance).toFixed(3))}
            </TableRowColumn>
          </TableRow>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};
//   }
// </TableBody>
