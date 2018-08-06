import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import _ from 'lodash';

let getOpeningBalanceDiffrence = accountGrpList => {
  let diff = 0;
  diff = getDebitAmountTotal(accountGrpList) - getCreditAmountTotal(accountGrpList);
  return diff;
};

let getDebitSideDiff = accountGrpList => {
  let diff = getOpeningBalanceDiffrence(accountGrpList);
  if (diff < 0) {
    return diff;
  }
};

let getCreditSideDiff = accountGrpList => {
  let diff = getOpeningBalanceDiffrence(accountGrpList);
  if (diff > 0) {
    return parseFloat(parseFloat(diff).toFixed(3));
  }
};
let getDebitAmountTotal = accountGrpList => {
  let sum = 0;
  _.map(accountGrpList, account => (sum += account.totalDebit));
  return parseFloat(parseFloat(sum).toFixed(3));
};

let getCreditAmountTotal = accountGrpList => {
  let sum = 0;
  _.map(accountGrpList, account => (sum += account.totalCredit));
  return parseFloat(parseFloat(sum).toFixed(3));
};

export const TableFooterComponent = ({ accountList, showYearlyView }) => (
  <React.Fragment>
    {!showYearlyView && (
      <TableRow displayBorder={false}>
        <TableRowColumn>Diffrence in opening balance</TableRowColumn>
        {getDebitSideDiff(accountList)}
        <TableRowColumn style={{ textAlign: 'end' }}>
          {getCreditSideDiff(accountList)}
        </TableRowColumn>
      </TableRow>
    )}
    <TableRow displayBorder={false}>
      <TableRowColumn>Grand Total</TableRowColumn>
      <TableRowColumn style={{ fontWeight: 'bold', textAlign: 'end' }}>
        Rs.{' '}
        {showYearlyView
          ? parseFloat(accountList.totalDebit).toFixed(3)
          : getDebitAmountTotal(accountList)}
      </TableRowColumn>
      <TableRowColumn style={{ fontWeight: 'bold', textAlign: 'end' }}>
        Rs.{' '}
        {showYearlyView
          ? parseFloat(accountList.totalCredit).toFixed(3)
          : getCreditAmountTotal(accountList)}
      </TableRowColumn>
      {showYearlyView && (
        <TableRowColumn style={{ fontWeight: 'bold', textAlign: 'end' }}>
          Rs. {parseFloat(accountList.closingBalance).toFixed(3)}
        </TableRowColumn>
      )}
    </TableRow>
  </React.Fragment>
);
