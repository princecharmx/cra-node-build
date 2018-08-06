import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import _ from 'lodash';
import * as moment from 'moment';

export const MonthlyBreakupComponent = ({ accountList, showLedgerView, showLedgerButton }) =>
  // <TableBody displayRowCheckbox={false} deselectOnClickaway={true}>
  //   {
  _.map(accountList.accountStatement, item => (
    <React.Fragment>
      <TableRow displayBorder={false} key={item} onCellClick={() => {}}>
        <TableRowColumn>{moment(item.date).format('D-MM-YYYY')}</TableRowColumn>
        <TableRowColumn>{item.voucherAccount}</TableRowColumn>
        <TableRowColumn>{item.voucherType}</TableRowColumn>
        <TableRowColumn>{item.invoiceNo}</TableRowColumn>
        <TableRowColumn style={{ textAlign: 'end' }}>
          Rs. {parseFloat(parseFloat(item.debit).toFixed(3))}
        </TableRowColumn>
        <TableRowColumn style={{ textAlign: 'end' }}>
          Rs. {parseFloat(parseFloat(item.credit).toFixed(3))}
        </TableRowColumn>
      </TableRow>
    </React.Fragment>
  ));
