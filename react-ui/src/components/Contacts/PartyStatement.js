import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import { getFormattedDate } from '../../utils';

const flexDiv = {
  display: 'flex',
  justifyContent: 'space-between',
  paddingLeft: '1.4rem',
  paddingRight: '1.4rem'
};

const mainDiv = {
  display: 'flex',
  paddingTop: '1.875rem',
  paddingBottom: '1.875rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontFamily: 'Dax Regular'
};

const renderPartyStatementCard = partyStatement => {
  return (
    <div>
      <div style={flexDiv}>
        <span style={{ color: '#26D367' }}>Opening Balance</span>
        <span>
          {getFormattedDate(partyStatement.startDate)} to {getFormattedDate(partyStatement.endDate)}
        </span>
        <span style={{ color: '#26D367' }}>Closing Balance</span>
      </div>
      <div style={flexDiv}>
        <span>
          Rs.{' '}
          {partyStatement.openingBalance
            ? parseFloat(partyStatement.openingBalance).toFixed(2)
            : parseFloat(0).toFixed(2)}
        </span>
        <span />
        <span>Rs. {parseFloat(partyStatement.closingBalance).toFixed(2)}</span>
      </div>
      {partyStatement && partyStatement.statement && <PartyStatementTable {...partyStatement} />}
    </div>
  );
};

/**
 * A simple table demonstrating the hierarchy of the `Table` component and its sub-components.
 */
const PartyStatementTable = ({ statement }) => {
  return (
    <Table selectable={false} fixedHeader={true} fixedFooter={true}>
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow displayBorder={false} style={{ 'border-bottom': '1px solid #333' }}>
          <TableHeaderColumn style={{ 'font-size': '16px' }} tooltip="Date">
            Date
          </TableHeaderColumn>
          <TableHeaderColumn style={{ 'font-size': '16px' }} tooltip="Voucher">
            Voucher No
          </TableHeaderColumn>
          <TableHeaderColumn style={{ 'font-size': '16px' }} tooltip="Debit">
            Debit
          </TableHeaderColumn>
          <TableHeaderColumn style={{ 'font-size': '16px' }} tooltip="Credit">
            Credit
          </TableHeaderColumn>
          <TableHeaderColumn style={{ 'font-size': '16px' }} tooltip="Balance">
            Balance
          </TableHeaderColumn>
        </TableRow>
      </TableHeader>
      {renderAccountList(statement)}
    </Table>
  );
};

const renderAccountList = accountList => (
  <TableBody displayRowCheckbox={false} deselectOnClickaway={true}>
    {_.map(accountList, account => (
      <React.Fragment>
        <TableRow displayBorder={false}>
          <TableRowColumn>{moment(account.createdAt).format('DD/MM/YY')}</TableRowColumn>
          <TableRowColumn style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
            {account.type.toUpperCase()} {account.voucherNo}
          </TableRowColumn>
          <TableRowColumn>Rs. {parseFloat(account.debit).toFixed(2)}</TableRowColumn>
          <TableRowColumn>Rs. {parseFloat(account.credit).toFixed(2)}</TableRowColumn>
          <TableRowColumn>Rs. {parseFloat(account.balance).toFixed(2)}</TableRowColumn>
        </TableRow>
      </React.Fragment>
    ))}
  </TableBody>
);

class PartyStatement extends Component {
  render() {
    const { partyStatement } = this.props;
    return <div style={mainDiv}>{partyStatement && renderPartyStatementCard(partyStatement)}</div>;
  }
}

export default PartyStatement;
