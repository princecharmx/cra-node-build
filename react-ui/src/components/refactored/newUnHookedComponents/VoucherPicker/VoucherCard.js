import React from 'react';
import styled from 'styled-components';

import { VoucherIcon, Cancel } from '../../../../images/index';

const Details = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #f5f5f6;
`;

const InvoiceIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const Row = styled.div`
  display: flex;
  width: calc(100% - 30px);
  height: 70%;
  padding: 0 5px 0 5px;
  align-items: center;
  justify-content: space-between;
`;
const Col = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
`;
const Branch = styled.h6``;
const Day = styled.h6``;
const AccountType = styled.h5`
  font-weight: 600;
  color: #1f1f1f;
`;
const Invoice = styled.h5`
  color: #1f1f1f;
`;

const Cross = styled.img`
  cursor: pointer;
  width: 18px;
  height: 18px;
`;
const VoucherCard = ({ voucherType, branch, invoiceNo, date, onClose }) => {
  return (
    <Details>
      <InvoiceIcon src={VoucherIcon} />
      <Row>
        <Col>
          <AccountType>{voucherType}</AccountType>
          <Branch>{branch}</Branch>
        </Col>

        <Col>
          <Invoice>{invoiceNo}</Invoice>
          <Day>{date}</Day>
        </Col>
        <Cross src={Cancel} onClick={onClose} />
      </Row>
    </Details>
  );
};

export { VoucherCard };
