import React from 'react';
import styled from 'styled-components';
import { Cancel, ShippingDetailsIcon } from '../../images';
import { ItemTextInput, AutoFillInput } from '../InputFields';
import Party from './PartyPicker/StyledComponents';
import { Button, ImageHolder } from '../AppStyledComponents';
import { TextField, DatePicker, Checkbox } from 'material-ui';
import { SummaryTitle, SummaryValue, SummarySubTitle } from './AddVoucherStyledComponents';
import { ThemeDefaultValues } from '../../ThemeProvider';
import { DisplayItemsContainer, SelectedVoucherText } from './ListAndViewVoucherStyledComponents';

const Container = styled.div`
  height: calc(100% - 20px);
  padding: 0.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #aaa;
  margin-bottom: 0.5rem;
`;

const Columns = styled.div`
  display: flex;
  height: calc(100% - 100px);
  align-items: flex-start;
  justify-content: space-between;
  align-self: stretch;
`;

const LeftColumn = styled.div`
  flex: 1;
  border: ${p => `1px solid ${ThemeDefaultValues.containerBorderColor}`};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-right: 0.5rem;
`;

const RightColumn = styled.div`
  flex: 2;
  border: ${p => `1px solid ${ThemeDefaultValues.containerBorderColor}`};
  overflow: auto;
  height: 100%;
  position: relative;
  padding-bottom: 1rem;
`;

const Title = styled.h1`
  color: #868686;
  font-family: 'roboto';
  font-size: 1.2rem;

  display: inline-block;
  margin: 0;
  margin-right: auto;
  margin-left: 10px;
`;

const Section = styled.div`
  margin-top: ${p => (p.marginTop ? p.marginTop : null)};
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: stretch;
  flex-direction: column;
  padding: ${p => (p.padding ? p.padding : '1rem')};
`;

const SectionTitle = styled.h2`
  ${p => p.top && `margin-top: 0px;`} display: flex;
  margin: 10px 0px 0px 0px;
  min-height: 30px;
  text-indent: 30px;
  background: #f5f5f5;
  align-items: center;
  width: 100%;
  font-family: 'roboto';
  padding-bottom: '15px';
  color: ${p => (p.color ? p.color : ThemeDefaultValues.tabFontColor)};
  font-size: ${p => (p.fontSize ? p.fontSize : ThemeDefaultValues.tabFontSize)};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : ThemeDefaultValues.tabFontWeight)};
`;

const TotalBlock = styled.h2`
  font-family: 'roboto';
  color: #b4b4b4;
  padding: 0.5rem;
  background: #f5f5f5;
  font-size: 1.1rem;
  font-weight: 500;
  position: relative;
  top: 16px;
  color: #000;
  display: flex;
  justify-content: space-between;
`;

const SummaryContentStyle = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  padding: 0 0.5rem;
`;

const HorizontalBlock = styled.div`
  flex-direction: column;
  justify-content: space-between;
  display: flex;
  padding-left: 10px;
`;

const ItemsStyle = styled.div`
  font-family: roboto;
  color: #b4b4b4;
  padding: 0.1rem 0 0.5rem 0;
  background: #f5f5f5;
  font-size: 1.1rem;
  font-weight: 500;
`;

const NarrationStyle = styled.div`
  position: relative;
  align-self: center;
  padding-left: 1rem;
  top: 3rem;
  width: 300px;
`;

const Bottom = styled.div`
  display: flex;
  padding-top: 2rem;
  width: calc(100% - 10px);
  justify-content: space-between;
`;

const SaveButton = props => (
  <Button to="#" margintop="0px" width="100px" height="30px" onClick={props.onClikSaveButton}>
    {props.label}
  </Button>
);

const NarrationBlock = props => (
  <NarrationStyle>
    <ItemTextInput
      onChange={value => {
        props.updateNarration(value);
      }}
      field="name"
      id="narration"
      hint="Narration"
      containerHeight="30px"
      value={props.value}
      {...props}
    />
  </NarrationStyle>
);

const SummaryContent = props => (
  <HorizontalBlock type="summary">
    <SummaryContentStyle>
      <SummaryTitle>
        {props.contentTitle ? props.contentTitle : 'Total Tax'}
        {props.toggleViewTaxAnalysis && (
          <SummarySubTitle onClick={props.toggleViewTaxAnalysis}>
            (View Tax Analysis)
          </SummarySubTitle>
        )}
      </SummaryTitle>
      <SummaryValue> {`Rs ${props.billTaxAmount}`} </SummaryValue>
    </SummaryContentStyle>
  </HorizontalBlock>
);
//TODO: business card and shpipping card is same, refactore it to common code
export const ShippingDetails = ({
  img,
  address = '',
  city = '',
  state = '',
  closeBusinessContactCard
}) => (
  <Party.Details>
    <Party.ImageHolder src={img ? img : ShippingDetailsIcon} width="30px" height="30px" />
    <Party.Description>
      <div style={{ paddingBottom: '5px' }}>
        {address && <Party.Address>{`${address}, ${city}, ${state}`}</Party.Address>}
      </div>
    </Party.Description>
    <Party.ImageHolder
      padding={'5px'}
      src={Cancel}
      width="14px"
      height="14px"
      onClick={closeBusinessContactCard}
    />
  </Party.Details>
);

const SummaryBlock = props => (
  <div>
    <SectionTitle>Summary</SectionTitle>
    <SummaryContent
      toggleViewTaxAnalysis={props.toggleViewTaxAnalysis}
      billTaxAmount={props.billTaxAmount}
      {...props}
    />
    <TotalBlock>
      <div style={{ marginLeft: '12px' }}>{props.totalText ? props.totalText : 'Total Amount'}</div>
      <div style={{ marginRight: '60px' }}>
        {' '}
        {`Rs ${props.roundoffValue ? props.roundoffValue : props.billFinalAmount}`}{' '}
      </div>
    </TotalBlock>
  </div>
);

const TextInput = ({ labelText, value, onChange, ...props }) => (
  <TextField
    type="text"
    floatingLabelText={labelText}
    style={{ fontFamily: 'Roboto' }}
    underlineStyle={{ borderColor: '#f5f5f5' }}
    onChange={event => onChange(event.target.value)}
    value={value}
    {...props}
  />
);

const DateInput = props => (
  <DatePicker
    autoOk={true}
    value={props.value}
    container="inline"
    style={{ width: '250px' }}
    floatingLabelText={props.labelText}
    onChange={(event, date) => props.onChange(event, date)}
    // textFieldStyle={{
    //   fontFamily: 'Dax Regular',
    //   fontSize: '14px',
    //   color: '#428bca',
    //   cursor: 'pointer'
    // }}
    // style={{
    //   color: '#428bca',
    //   fontFamily: 'Dax Regular',
    //   fontSize: '13px'
    // }}
  />
);

const CheckboxInput = props => (
  <Checkbox
    style={{ marginTop: '16px' }}
    iconStyle={{ fill: '#bbbbbc' }}
    labelStyle={{
      fontSize: '14px',
      color: '#bbbbbc',
      fontFamily: 'Dax Regular'
    }}
    {...props}
  />
);

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const SummaryBlockPosition = styled.div`
  width: 100%;
`;

const Autocomplete = props => (
  <div style={{ paddingTop: 15 }}>
    <AutoFillInput
      hint={props.hint}
      width="251px"
      labelText={props.labelText}
      dataSource={props.dataSource}
      searchText={props.searchText}
      onUpdateInput={props.onUpdateInput}
      maxSearchResults={props.maxSearchResults}
    />
  </div>
);

const RenderShippingSection = shippingAddress => (
  <DisplayItemsContainer>
    <SelectedVoucherText fontSize="14px" type="address">
      {' '}
      {`${shippingAddress && shippingAddress.address},`}{' '}
    </SelectedVoucherText>
    <SelectedVoucherText fontSize="14px" type="address">
      {' '}
      {`${shippingAddress && shippingAddress.city}, ${shippingAddress &&
        shippingAddress.country},`}{' '}
    </SelectedVoucherText>
    <SelectedVoucherText fontSize="14px" type="address">
      {' '}
      {`Pincode: ${shippingAddress && shippingAddress.pincode}`}{' '}
    </SelectedVoucherText>
  </DisplayItemsContainer>
);

export default {
  FlexContainer,
  SaveButton,
  Container,
  Header,
  Columns,
  ImageHolder,
  LeftColumn,
  RightColumn,
  SummaryBlockPosition,
  Title,
  Section,
  Autocomplete,
  SectionTitle,
  TextInput,
  DateInput,
  CheckboxInput,
  SummaryBlock,
  ItemsStyle,
  Bottom,
  NarrationBlock,
  ShippingDetails,
  RenderShippingSection
};
