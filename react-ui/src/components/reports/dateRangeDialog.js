import styled from 'styled-components';
import React, { Component } from 'react';
// import * as CONSTANTS from '../constants';

import { Dialog, DatePicker } from 'material-ui';
import FlatButton from 'material-ui/FlatButton';

const Fields = styled.div`
  display: flex;
  padding: 30px 30px 0px 30px;
  justify-content: space-between;
`;

class DateRangeDialog extends Component {
  state = {
    startDate: new Date(this.props.dateRange.startDate),
    endDate: new Date(this.props.dateRange.endDate)
  };
  render() {
    const { showPeriodDialog, showPeriodDialogAction, changeDateRange } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => {
          showPeriodDialogAction();
          // cancelItemSalesPrice();
        }}
      />,
      <FlatButton
        label="change"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          changeDateRange(this.state);
          // setShowSalesPriceValue();
        }}
      />
    ];
    return (
      <React.Fragment>
        <Dialog
          title="Select Date Range"
          actions={actions}
          modal={false}
          open={showPeriodDialog}
          onRequestClose={this.handleClose}
        >
          <Fields>
            <DatePicker
              autoOk={true}
              value={this.state.startDate}
              // style={{ width: '250px' }}
              floatingLabelText="Start Date"
              onChange={(event, date) => {
                this.setState({
                  startDate: date
                });
              }}
            />
            <DatePicker
              autoOk={true}
              value={this.state.endDate}
              minDate={this.state.startDate}
              // style={{ width: '250px' }}
              floatingLabelText="End Date"
              onChange={(event, date) => {
                this.setState({
                  endDate: date
                });
              }}
            />
          </Fields>
        </Dialog>
      </React.Fragment>
    );
  }
}

// export default itemGroupDialog;
export default DateRangeDialog;
