import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import _ from 'lodash';
import { ImageHolder } from '../AppStyledComponents';
import { ThemeDefaultValues } from '../../ThemeProvider';

export const TableBodyComponent = ({ accountList, showYearlyViewAction, getAccountByPath }) =>
  // <TableBody displayRowCheckbox={false} deselectOnClickaway={true}>
  //   {
  _.map(accountList, account => (
    <React.Fragment>
      <TableRow
        displayBorder={false}
        key={account}
        onCellClick={() => {
          if (account.isAccount) {
            showYearlyViewAction(account.account);
          } else {
            getAccountByPath(account);
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <TableRowColumn style={{ textAlign: 'left' }}>
          {!account.isAccount && (
            <ImageHolder
              src={ThemeDefaultValues.report.ledgerWise}
              position="relative"
              top="7px"
              left="-3px"
            />
          )}
          {account.account ? account.account.name : account.accountGroup}
        </TableRowColumn>
        <TableRowColumn style={{ textAlign: 'end' }}>
          Rs. {parseFloat(parseFloat(account.totalDebit).toFixed(3))}
        </TableRowColumn>
        <TableRowColumn style={{ textAlign: 'end' }}>
          Rs. {parseFloat(parseFloat(account.totalCredit).toFixed(3))}
        </TableRowColumn>
      </TableRow>
    </React.Fragment>
  ));
//   }
// </TableBody>
