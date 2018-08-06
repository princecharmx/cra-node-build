import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import _ from 'lodash';
import { ImageHolder } from '../AppStyledComponents';
import { ThemeDefaultValues } from '../../ThemeProvider';

const renderAccounFordetailedView = (accountList, getAccountByPath, showYearlyViewAction) => (
  <React.Fragment>
    {_.map(accountList, account => (
      <TableRow
        displayBorder={false}
        style={{ width: '100%', cursor: 'pointer' }}
        onCellClick={() => {
          if (!account.isAccount) {
            getAccountByPath(account);
          } else {
            showYearlyViewAction(account.account);
          }
        }}
      >
        <TableRowColumn style={{ width: '800px', paddingLeft: '50px' }}>
          {account.isAccount && (
            <ImageHolder
              src={ThemeDefaultValues.report.ledgerWise}
              position="relative"
              top="7px"
              left="-3px"
            />
          )}
          {account.secondary}
        </TableRowColumn>
        <TableRowColumn style={{ textAlign: 'end', paddingRight: '50px' }}>
          Rs. {parseFloat(parseFloat(account.debitAmount).toFixed(3))}
        </TableRowColumn>
        <TableRowColumn style={{ textAlign: 'end', paddingRight: '50px' }}>
          Rs. {parseFloat(parseFloat(account.creditAmount).toFixed(3))}
        </TableRowColumn>
      </TableRow>
    ))}
  </React.Fragment>
);

export const TrialBalanceTableComponent = ({
  accountList,
  showDetailButton,
  showDetailView,
  getAccountByPath,
  headerProperties,
  showYearlyViewAction
}) =>
  _.map(accountList, account => (
    <React.Fragment>
      <TableRow
        displayBorder={false}
        key={account}
        onCellClick={() => {
          if (headerProperties.renderSubGrp) {
            showDetailView(account.accountGroup, account);
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <TableRowColumn style={{ textAlign: 'left' }}>
          {showDetailButton ? (
            <ImageHolder
              src={ThemeDefaultValues.report.unCollapse}
              position="relative"
              top="7px"
              left="-3px"
            />
          ) : (
            <ImageHolder
              src={ThemeDefaultValues.report.collapse}
              position="relative"
              top="7px"
              left="-3px"
            />
          )}
          {headerProperties.renderSubGrp ? account.accountGroup : account.account.name}
        </TableRowColumn>
        <TableRowColumn style={{ textAlign: 'end' }}>
          Rs. {parseFloat(parseFloat(account.totalDebit).toFixed(3))}
        </TableRowColumn>
        <TableRowColumn style={{ textAlign: 'end' }}>
          Rs. {parseFloat(parseFloat(account.totalCredit).toFixed(3))}
        </TableRowColumn>
      </TableRow>

      {!showDetailButton &&
        headerProperties.renderSubGrp &&
        renderAccounFordetailedView(account.secondary, getAccountByPath, showYearlyViewAction)}
    </React.Fragment>
  ));
