import React from 'react';
import map from 'lodash/map';

import {
  FormRow,
  FormBlock,
  FormBlockTitle,
  ItemHeader,
  FieldsContainer,
  HorizontalFields
} from '../AddVoucherStyledComponents';
import { ItemTextInput } from '../../InputFields';

const TaxBreakup = ({ taxBreakup, totalTax, payload }) => (
  <FormRow type="fourthRow">
    <FormBlock width="60%">
      <FormBlockTitle>Tax Breakup</FormBlockTitle>

      <FieldsContainer>
        <HorizontalFields type="header">
          <ItemHeader width="25%">Tax</ItemHeader>
          <ItemHeader width="25%">IGST</ItemHeader>
          <ItemHeader width="25%">SGST</ItemHeader>
          <ItemHeader width="25%">CGST</ItemHeader>
        </HorizontalFields>

        {map(taxBreakup, (tax, key) => (
          <HorizontalFields key={key}>
            <ItemTextInput
              readOnly={true}
              id={`TaxBreakup${key}`}
              containerWidth="25%"
              containerHeight="30px"
              value={`${tax.taxPercentage}% (${tax.tax})`}
            />

            <ItemTextInput
              readOnly={true}
              id={`igst${key}`}
              containerWidth="25%"
              containerHeight="30px"
              value={'0'}
            />

            <ItemTextInput
              readOnly={true}
              id={`sgst${key}`}
              containerWidth="25%"
              containerHeight="30px"
              value={`${tax.taxPercentage / 2}% (${tax.tax / 2})`}
            />

            <ItemTextInput
              readOnly={true}
              id={`cgst${key}`}
              containerWidth="25%"
              containerHeight="30px"
              value={`${tax.taxPercentage / 2}% (${tax.tax / 2})`}
            />
          </HorizontalFields>
        ))}

        <HorizontalFields>
          <ItemTextInput
            id="1"
            readOnly={true}
            containerWidth="25%"
            containerHeight="30px"
            value={`Rs.${totalTax}`}
          />

          <ItemTextInput
            id="2"
            readOnly={true}
            containerWidth="25%"
            containerHeight="30px"
            value="Rs.0"
          />

          <ItemTextInput
            id="3"
            readOnly={true}
            containerWidth="25%"
            containerHeight="30px"
            value={`Rs.${totalTax / 2}`}
          />

          <ItemTextInput
            id="4"
            readOnly={true}
            containerWidth="25%"
            containerHeight="30px"
            value={`Rs.${totalTax / 2}`}
          />
        </HorizontalFields>
      </FieldsContainer>

      <FieldsContainer />
    </FormBlock>

    <FormBlock width="40%">
      <FormBlockTitle />
      <HorizontalFields paddingTop="20px">
        <ItemTextInput
          field="name"
          id="narration"
          hint="Narration"
          containerHeight="30px"
          containerWidth="calc(100% - 30px)"
          value={payload.narration}
          onChange={value => {
            this.setState({
              payload: {
                ...payload,
                narration: value
              }
            });
          }}
        />
      </HorizontalFields>
      {/*
     <Fields type="summary">
      <HorizontalBlock type="summary">
        <SummaryBlock>
          <SummaryTitle>Total Price</SummaryTitle>
          <SummaryValue> {`Rs ${payload.billItemsPrice}`} </SummaryValue>
        </SummaryBlock>
        <SummaryBlock>
          <SummaryTitle>Discount</SummaryTitle>
          <SummaryValue> {`Rs ${payload.billDiscountAmount}`} </SummaryValue>
        </SummaryBlock>
        <SummaryBlock>
          <SummaryTitle>Tax</SummaryTitle>
          <SummaryValue> {`Rs ${payload.billTaxAmount}`} </SummaryValue>
        </SummaryBlock>
        <SummaryBlock>
          <SummaryTitle>Total Amount</SummaryTitle>
          <SummaryValue> {`Rs ${payload.billFinalAmount}`} </SummaryValue>
        </SummaryBlock>
        <SummaryBlock>
          <SummaryTitle>Balance Due</SummaryTitle>
          <SummaryValue> {`Rs ${payload.dueAmount}`} </SummaryValue>
        </SummaryBlock>
      </HorizontalBlock>
    </Fields> */}
    </FormBlock>
  </FormRow>
);

export default TaxBreakup;
