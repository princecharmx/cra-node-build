import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { GoBack } from '../../../../images/index';
import { toggleViewTaxAnalysis } from '../../../../actions/vouchers';
import { getTaxAnalysisData } from '../../../../reducers';
const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const Flex = styled.div`
  display: flex;
`;
const Back = styled.img`
  width: 15px;
  height: 15px;
`;

const BackContainer = Flex.extend`
  padding: 5px;
  width: 100px;
  align-items: center;
  justify-content: space-around;
`;
const Header = Flex.extend`
  width: 100%;
  min-height: 30px;
  text-indent: 30px;
  background: #f5f5f5;
  align-items: center;
  font-family: 'Dax Regular';
  color: ${p => (p.color ? p.color : '#b4b4b4')};
  font-size: '15px';
  font-weight: '600';
`;
const SubContainer = FlexCol.extend`
  padding: 5px 20px 5px 20px;
`;
const TableHeader = styled.th`
  color: #b4b4b4;
  background: #f5f5f5;
`;
const PackingDetails = styled.div`
  color: #b4b4b4;
  padding-left: 5px;
`;
const Details = FlexCol.extend`
  margin: 20px;
`;
const DetailsBorder = Details.extend`
  margin: 20px;
  padding-bottom: 5px;
  border-bottom-style: solid;
  border-bottom-width: thin;
`;
const ItemName = Flex.extend`
  font-weight: 400;
  font-family: 'Dax Regular';
  justify-content: flex-start;
`;
const ItemDetails = Flex.extend`
  color: #b4b4b4;
  justify-content: flex-start;
`;
const Total = Flex.extend`
  color: #b4b4b4;
  padding-left: 15px;
  justify-content: flex-start;
`;
class TaxAnalysis extends Component {
  renderOtherChargesTaxBreakupTax = (otherCharges, key) => {
    return <ItemName key={`12236#${key}`}>{`Rs ${otherCharges.tax}`}</ItemName>;
  };
  renderOtherChragesTaxBreakUpPrice = (otherCharges, key) => {
    return (
      <ItemName key={`12235#${key}`}>
        {`Rs ${otherCharges.price}`}
        <PackingDetails>{otherCharges.formulaToDisplay}</PackingDetails>
      </ItemName>
    );
  };
  renderOtherChargesTaxBreakupName = (otherCharges, key) => {
    return <ItemDetails key={`12234#${key}`}>{`+ ${otherCharges.accountName}`}</ItemDetails>;
  };

  renderTaxAnalysis = (item, key) => {
    return (
      <SubContainer key={`1223#${key}`}>
        <table>
          <tr>
            <TableHeader>Sno</TableHeader>
            <TableHeader>Particular</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Tax Amount</TableHeader>
          </tr>

          <tr>
            <td style={{ textAlign: 'center' }}>{`${item.sNo}`}</td>
            <td>
              <Details>
                <ItemName>{item.name}</ItemName>
                {item.otherChargesTaxBreakup.map(otherCharges =>
                  this.renderOtherChargesTaxBreakupName(otherCharges, key)
                )}
              </Details>
            </td>
            <td style={{ textAlign: 'center' }}>
              <DetailsBorder>
                <ItemName>{`Rs ${item.price}`}</ItemName>
                {item.otherChargesTaxBreakup.map(otherCharges =>
                  this.renderOtherChragesTaxBreakUpPrice(otherCharges, key)
                )}
              </DetailsBorder>
              <Total>
                {`Total`}
                <ItemName>{`Rs ${item.totalPrice}`}</ItemName>
              </Total>
            </td>
            <td style={{ textAlign: 'center' }}>
              <DetailsBorder>
                <ItemName>{`Rs ${item.tax}`}</ItemName>
                {item.otherChargesTaxBreakup.map(otherCharges =>
                  this.renderOtherChargesTaxBreakupTax(otherCharges, key)
                )}
              </DetailsBorder>
              <Total>
                {`Total`}
                <ItemName>{`Rs ${item.totalTax}`}</ItemName>
              </Total>
            </td>
          </tr>
        </table>
      </SubContainer>
    );
  };

  render() {
    const { toggleTaxAnalysis, taxAnalysis, toggleViewTaxAnalysis } = this.props;
    return (
      <FlexCol onClick={toggleTaxAnalysis}>
        <BackContainer>
          <Back src={GoBack} onClick={toggleViewTaxAnalysis} /> Back
        </BackContainer>
        <Header>Tax Analysis</Header>
        {taxAnalysis.map((item, index) => this.renderTaxAnalysis(item, index))}
      </FlexCol>
    );
  }
}

const mapStateToProps = ({ vouchers: { _voucherModuleResults: { taxAnalysis } } }) => ({
  taxAnalysis: getTaxAnalysisData(taxAnalysis)
});

const TaxAnalysisComponent = connect(mapStateToProps, { toggleViewTaxAnalysis })(TaxAnalysis);
export { TaxAnalysisComponent };
