import React from 'react';
import styled from 'styled-components';

import { TextInputField, DateTime } from '../../index';
import { Fields } from '../AddVoucherStyledComponents';

const ButtonContaner = styled.div`
  display: flex;
  padding: 0.5rem;
  justify-content: flex-end;
`;

const SubmitButton = styled.div`
  color: ${p => (p.isDisable ? '#95989A' : '#4964DA')};
  padding: 0.5rem;
  &: hover {
    cursor: ${p => (p.isDisable ? 'not-allowed' : 'pointer')};
  }
`;

export const TransportDetials = ({
  isDisable,
  transportDetails,
  updateTransportDetails,
  handleCancleOnClick,
  handleDoneOnClick
}) => (
  <React.Fragment>
    <Fields>
      <TextInputField
        width={'300px'}
        hint="Delivery note no [20000]"
        labelSize="2px"
        value={transportDetails.deliveryNote}
        onChange={value => updateTransportDetails('deliveryNote', value)}
        labelText="Delivery Note No"
      />

      <DateTime
        width={'300px'}
        labelSize="2px"
        labelText="Date"
        maxDate={new Date('2028-06-06T18:30:00.000Z')}
        formatDate={value => value}
        value={transportDetails.date}
        onChange={value => updateTransportDetails('date', value)}
      />

      <TextInputField
        width={'300px'}
        hint="Dispatch doc no [12345]"
        labelSize="2px"
        labelText="Dispatch Doc No"
        value={transportDetails.dispatchDocNo}
        onChange={value => updateTransportDetails('dispatchDocNo', value)}
      />

      <TextInputField
        width={'300px'}
        hint="Mumbai Transport Pvt Ltd"
        labelSize="2px"
        labelText="Dispatch Through"
        value={transportDetails.dispatchThrough}
        onChange={value => updateTransportDetails('dispatchThrough', value)}
      />

      <TextInputField
        width={'300px'}
        hint="New Delhi"
        labelSize="2px"
        labelText="Destination"
        value={transportDetails.destination}
        onChange={value => updateTransportDetails('destination', value)}
      />

      <TextInputField
        width={'300px'}
        hint="Truck No DL052011"
        labelSize="2px"
        labelText="Motor Vehicle No"
        value={transportDetails.motarVechileNo}
        onChange={value => updateTransportDetails('motarVechileNo', value)}
      />
    </Fields>
    <ButtonContaner>
      <SubmitButton isDisable={isDisable} onClick={isDisable ? null : handleCancleOnClick}>
        {' '}
        Cancel
      </SubmitButton>
      <SubmitButton isDisable={isDisable} onClick={isDisable ? null : handleDoneOnClick}>
        {' '}
        Done
      </SubmitButton>
    </ButtonContaner>
  </React.Fragment>
);
