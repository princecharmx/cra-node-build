import React from 'react';

import { ShippingDetailsFields, VoucherDetailsFields } from './addSPCDComponent/index';
import Voucher from './VoucherBuilder';
import PartyPicker from './PartyPicker';
import { CityStateAutopopulate } from '../../utils';
import Transport from './TransportDetails/Transport';
import styled from 'styled-components';

export const RenderParty = ({ businessAccountsSuggestions, mode }) => (
  <React.Fragment>
    <Voucher.SectionTitle top>Party</Voucher.SectionTitle>
    <PartyPicker dataSource={businessAccountsSuggestions} mode={mode} />
  </React.Fragment>
);
export const RenderVoucherDetails = (fetchAccountsDetails, mode) => (
  <React.Fragment>
    <Voucher.SectionTitle>Voucher Details</Voucher.SectionTitle>
    <VoucherDetailsFields fetchAccountsDetails={fetchAccountsDetails} mode={mode} />
  </React.Fragment>
);

export const RenderShippingDetails = ({ mode }) => (
  <React.Fragment>
    <Voucher.SectionTitle>Shipping Details</Voucher.SectionTitle>
    <CityStateAutopopulate>
      {props => {
        return (
          <ShippingDetailsFields
            location={props.location}
            geocodeByAddress={props.geocodeByAddress}
            mode={mode}
          />
        );
      }}
    </CityStateAutopopulate>
  </React.Fragment>
);

export const RenderSummaryBlock = ({
  summaryBlockData: { billTaxAmount, billFinalAmount, roundoffValue },
  toggleViewTaxAnalysis
}) => (
  <Voucher.SummaryBlock
    billTaxAmount={billTaxAmount}
    billFinalAmount={billFinalAmount}
    roundoffValue={roundoffValue}
    toggleViewTaxAnalysis={toggleViewTaxAnalysis}
  />
);

export const RenderTransportDetails = () => (
  <React.Fragment>
    <Voucher.SectionTitle>Transport Details</Voucher.SectionTitle>
    <Transport />
  </React.Fragment>
);

export const AgainstVoucherContainer = styled.div`
  display: flex;
  padding: 1rem;
  width: 100%;
  align-items: center;
  justify-content: ${p => (p.type === 'spread' ? 'space-between' : 'end')};
  &:hover {
    cursor: pointer;
  }
`;
export const ImageHolder = styled.img`
  width: 1rem;
  height: 1rem;
`;
export const Title = styled.div`
  font-weight: 400;
  color: #2400ff;
  padding-left: 1.1rem;
`;
export const SubTitle = styled.div`
  color: #95989a;
`;
export const IconHolder = styled.div`
  width: 13rem;
  display: flex;
`;
