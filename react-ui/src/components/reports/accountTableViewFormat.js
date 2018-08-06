import React from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import _ from 'lodash';

const TrialBalanceTable = ({
  accountList,
  showDetailButton,
  showDetailView,
  setRoutingStatus,
  getAccountByPath
}) => (
  //TODO:make header a genric component  for all types
  <Table selectable={true} fixedHeader={true} fixedFooter={true} height="280px">
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow displayBorder={false} style={{ backgroundColor: '#f9f9fb', textColor: 'Black' }}>
        <TableHeaderColumn
          tooltip="Particulars"
          style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'left' }}
        >
          Particulars
        </TableHeaderColumn>
        <TableHeaderColumn
          tooltip="Debit"
          style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'end' }}
        >
          Debit
        </TableHeaderColumn>
        <TableHeaderColumn
          tooltip="Credit"
          style={{ fontWeight: 'bold', fontSize: '15px', textColor: 'Black', textAlign: 'end' }}
        >
          Credit
        </TableHeaderColumn>
      </TableRow>
    </TableHeader>
    {renderAccountList(
      accountList,
      showDetailButton,
      showDetailView,
      setRoutingStatus,
      getAccountByPath
    )}
    {/*TODO: remove this is card footer make a genric component*/}
    <TableFooter adjustForCheckbox={false}>
      <TableRow displayBorder={false}>
        <TableRowColumn>Diffrence in opening balance</TableRowColumn>
        {getDebitSideDiff(accountList, showDetailButton)}
        <TableRowColumn style={{ textAlign: 'end' }}>
          {getCreditSideDiff(accountList)}
        </TableRowColumn>
      </TableRow>
      <TableRow displayBorder={false}>
        <TableRowColumn>Grand Total</TableRowColumn>
        <TableRowColumn style={{ fontWeight: 'bold', textAlign: 'end' }}>
          {getDebitAmountTotal(accountList)}
        </TableRowColumn>
        <TableRowColumn style={{ fontWeight: 'bold', textAlign: 'end' }}>
          {getCreditAmountTotal(accountList)}
        </TableRowColumn>
        {/*this is card footer*/}
      </TableRow>
    </TableFooter>
  </Table>
);

const renderAccountList = (
  accountList,
  showDetailButton,
  showDetailView,
  setRoutingStatus,
  getAccountByPath,
  headerProperties
) => (
  <TableBody displayRowCheckbox={false} deselectOnClickaway={true}>
    {_.map(accountList, account => (
      <React.Fragment>
        <TableRow displayBorder={false} key={account} onCellClick={() => {}}>
          <TableRowColumn>{account.account.name}</TableRowColumn>
          <TableRowColumn style={{ textAlign: 'end' }}>
            Rs. {parseFloat(parseFloat(account.totalDebit).toFixed(3))}
          </TableRowColumn>
          <TableRowColumn style={{ textAlign: 'end' }}>
            Rs. {parseFloat(parseFloat(account.totalCredit).toFixed(3))}
          </TableRowColumn>
        </TableRow>
      </React.Fragment>
    ))}
  </TableBody>
);

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

export const AccountTableViewFormat = ({ accountList, showLedgerView, showLedgerButton }) => (
  <TrialBalanceTable
    accountList={accountList}
    showLedgerView={showLedgerView}
    showLedgerButton={showLedgerButton}
  />
);
