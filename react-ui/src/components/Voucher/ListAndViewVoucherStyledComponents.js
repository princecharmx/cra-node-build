import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  background: transparent;
  justify-content: space-between;
`;

export const LeftHalfContainer = styled.div`
  width: 30%;
  display: flex;
  height: inherit;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
`;

export const RightHalfContainer = styled.div`
  display: flex;
  height: inherit;
  margin-left: 30px;
  overflow-y: scroll;
  width: calc(70% - 30px);
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
  ${props =>
    props.type === 'empty'
      ? `
    align-items: center;
    justify-content: center;
  `
      : `
    align-items: center;
    justify-content: flex-start;
  `};
`;

export const VoucherCard = styled(Link)`
  height: 80px;
  display: flex;
  cursor: pointer;
  padding: 0px 30px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e7e7e8;
  background-color: ${props => props.bgcolor};
  -webkit-transition: all 500ms ease-in-out;
  -moz-transition: all 500ms ease-in-out;
  -ms-transition: all 500ms ease-in-out;
  -o-transition: all 500ms ease-in-out;
  transition: all 500ms ease-in-out;
  &:hover {
    background-color: #f9f9fb;
    -webkit-transition: all 500ms ease-in-out;
    -moz-transition: all 500ms ease-in-out;
    -ms-transition: all 500ms ease-in-out;
    -o-transition: all 500ms ease-in-out;
    transition: all 500ms ease-in-out;
  }
`;

export const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const VoucherDetails = LeftContainer.extend`
  height: 40px;
  align-items: flex-start;
  flex-direction: column;
`;

export const VoucherTitle = styled.div`
  ${props =>
    props.type === 'empty'
      ? `
    width: 100%;
    color: #b2b2b2;
    font-size: 15px;
    font-weight: 600;
    text-align: center;
  `
      : `
    width: 90px;
    font-size: 15px;
    color: #121212;
  `};
`;

export const VoucherSubTitle = styled.div`
  font-size: 14px;
  color: ${props => (props.type === 'time' ? '#28d368' : '#b2b2b2')};
`;

export const ImageHolder = styled.img`
  background-color: transparent;
  width: ${p => (p.width ? p.width : '30px')};
  height: ${p => (p.height ? p.height : '30px')};
  cursor: ${p => (p.type === 'leftPadding' ? 'pointer' : 'unset')};
  ${p => p.type === 'empty' && `margin-bottom: 20px;`};
  ${p => p.type === 'leftPadding' && `margin-left: 5px;`};
`;

export const SelectedVoucherRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  ${p => p.margin === 'top' && `margin-top: 15px;`};
  align-items: ${p => (p.type === 'container' ? 'flex-start' : 'center')};
`;

export const SelectedVoucherText = styled.div`
  cursor: ${p => (p.cursor ? p.cursor : 'unset')};
  color: ${p => (p.color ? p.color : '#4A4A4A')};
  font-size: ${p => (p.fontSize ? p.fontSize : '14px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
  ${p => p.type === 'empty' && `margin-left: 5px;`};
  ${p => p.type === 'address' && `text-indent: 30px; margin-top: 5px;`};
`;

export const SelectedVoucherActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ActionBlock = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  ${props => props.margin === 'right' && `margin-right: 40px;`};
`;

export const DisplayHorizontalField = styled.div`
  display: flex;
  margin-left: 30px;
  margin-right: 30px;
  flex-direction: row;
  align-items: center;
  width: calc(100% - 60px);
  justify-content: flex-start;
  ${p => p.blockType === 'content' && `margin-top: 10px`};
`;

export const DisplayItemsContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 15px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const DisplayItem = styled.div`
  display: flex;
  align-items: center;
  font-family: 'Dax Regular';
  width: ${p => (p.width ? p.width : '50px')};
  color: ${p => (p.color ? p.color : '#868686')};
  font-size: ${p => (p.fontSize ? p.fontSize : '12px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '600')};
  justify-content: ${p => (p.type === 'name' ? 'flex-start' : 'center')};
  ${p => p.blockType === 'header' && `border-bottom: 1px solid #95989A;`};
  ${p =>
    p.type === 'description' &&
    `
    word-break: break-all;
    justify-content: flex-start;
  `};
`;

export const FormBlock = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: ${props => (props.width ? props.width : '100%')};
`;

export const FormBlockTitle = styled.div`
  width: 100%;
  display: flex;
  min-height: 30px;
  text-indent: 30px;
  background: #f5f5f5;
  align-items: center;
  font-family: 'Dax Regular';
  color: ${p => (p.color ? p.color : '#b4b4b4')};
  font-size: ${p => (p.fontSize ? p.fontSize : '15px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '600')};
`;

export const HorizontalBlock = styled.div`
  display: flex;
  ${props =>
    props.type === 'buttons'
      ? `
  width: auto;
  margin-bottom: 30px;
  align-items: center;
  justify-content: space-between;
`
      : `
  align-items: flex-start;
  width: 100%;
  justify-content: space-between;
`} ${props =>
      props.type === 'summary' &&
      `
  padding-top: 20px;
  flex-direction: column;
`} ${props =>
      props.type === 'withErrors' &&
      `
  margin-bottom: 10px;
`};
`;

export const SummaryBlock = HorizontalBlock.extend`
  height: 20px;
  align-items: center;
  margin-bottom: 10px;
  justify-content: flex-start;
  ${p =>
    p.blockType === 'itemSummary' &&
    `
  margin-left: 30px;
  width: calc(100% - 30px);
`} ${p =>
      p.itemType === 'narration' &&
      `
  flex-direction: column;
  align-items: flex-start;
  height: 30px;
`};
`;

export const SummaryTitle = styled.div`
  width: 130px;
  color: #3d3d3d;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Dax Regular';
  ${p =>
    p.itemType === 'narration' &&
    `
  min-height: 29px;
  width: calc(100% - 60px);
  border-bottom: 1px solid #868686;
`};
`;

export const SummaryValue = styled.div`
  width: 100px;
  color: #3d3d3d;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Dax Regular';
  ${p =>
    p.itemType === 'narration' &&
    `
  margin-top: 10px;
  margin-bottom: 10px;
  word-break: break-all;
  width: calc(100% - 60px);
`};
`;

export const SingleRow = styled.div`
  display: flex;
  width: inherit;
  align-items: center;
  justify-content: center;
  ${p => {
    switch (p.type) {
      case 'lastRow':
        return `margin: 0px;`;
      case 'viewMore':
        return `margin-top: 15px;`;
      default:
        return `margin: 30px 0px;`;
    }
  }};
`;

export const NotesContainer = styled.div`
  width: 300px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const SelectedVoucherBlock = styled.div`
  display: flex;
  flex-shrink: 0;
  aling-items: flex-start;
  justify-content: space-between;
  flex-direction: ${p => (p.type === 'secondRow' || p.type === 'fourthRow' ? 'row' : 'column')};
  min-height: ${p => {
    switch (p.type) {
      case 'firstRow':
        return '10vh';
      case 'secondRow':
        return '15vh';
      case 'thirdRow':
        return '5vh';
      case 'fourthRow':
        return 'unset';
      default:
        return 'unset';
    }
  }};
  padding: ${p => {
    switch (p.padding) {
      case 'lbr':
        return '0px 30px 30px 30px';
      case 'tlr':
        return '30px 30px 0px 30px';
      case 'tbl':
        return '30px 0px 30px 30px';
      case 'tbr':
        return '30px 30px 30px 0px';
      case 't':
        return '30px 0px 0px 0px';
      case 'r':
        return '0px 30px 0px 0px';
      case 'b':
        return '0px 0px 30px 0px';
      case 'l':
        return '0px 0px 0px 30px';
      default:
        return '0px';
    }
  }};
`;

export const Navigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 30px 30px 30px;
`;

export const BackLink = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
`;

export const Text = styled.div`
  color: ${p => (p.color ? p.color : '#000000')};
  cursor: ${p => (p.cursor ? p.cursor : 'default')};
  font-size: ${p => (p.fontSize ? p.fontSize : '16px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
  padding-top: ${p => (p.paddingTop ? p.paddingTop : '0px')};
  padding-left: ${p => (p.paddingLeft ? p.paddingLeft : '0px')};
  padding-right: ${p => (p.paddingRight ? p.paddingRight : '0px')};
  padding-bottom: ${p => (p.paddingBottom ? p.paddingBottom : '0px')};
  margin-top: ${p => (p.marginTop ? p.marginTop : '0px')};
  margin-left: ${p => (p.marginLeft ? p.marginLeft : '0px')};
  margin-right: ${p => (p.marginRight ? p.marginRight : '0px')};
  margin-bottom: ${p => (p.marginBottom ? p.marginBottom : '0px')};
`;

export const NotesInputFields = styled.div`
  display: flex;
  width: inherit;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  justify-content: ${props => (props.type === 'formField' ? `space-around` : `space-between`)};
`;

export const NotesOptions = styled.div`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DisplayNote = styled.div`
  height: 30px;
  display: flex;
  width: inherit;
  flex-shrink: 0;
  margin-top: 10px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

export const NoteRow = styled.div`
  display: flex;
  width: inherit;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const StyledSpan = styled.span`
  color: #2e6eaf;
  font-size: 15px;
  cursor: pointer;
  font-weight: 400;
  text-align: center;
`;

export const PopupTitleContainer = styled.div`
  margin: 0px;
  display: flex;
  line-height: 32px;
  align-items: center;
  padding: 24px 24px 20px;
  color: rgba(0, 0, 0, 0.87);
  justify-content: space-between;
`;

export const PaymentHistoryContainer = styled.div`
  margin: 12px 0px 0px 0px;
`;

export const PopupRow = styled.div`
  display: flex;
  padding-top: 10px;
  aling-items: flex-start;
  justify-content: space-between;
`;

export const PaymentHistoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

export const PaymentHistoryText = styled.div`
  width: ${p => (p.width ? p.width : '138px')};
  color: ${p => (p.color ? p.color : '#4A4A4A')};
  cursor: ${p => (p.cursor ? p.cursor : 'unset')};
  font-size: ${p => (p.fontSize ? p.fontSize : '14px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
`;

export const ShareContactSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`;

export const ContactCard = styled.div`
  width: 150px;
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  justify-content: flex-start;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  ${p => p.padding === 'left' && `padding-left: 20px;`};
`;

export const ContactInfo = styled.div`
  line-height: 20px;
  color: ${p => (p.color ? p.color : '#000000')};
  font-size: ${p => (p.fontSize ? p.fontSize : '14px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
`;

export const ShareContactsField = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const ListItemsAndInputField = styled.div`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`;

export const ShareListHeader = styled.div`
  color: #868686;
  font-size: 14px;
  font-weight: 600;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
  text-transform: uppercase;
`;

export const SharedListFlexItem = styled.div`
  display: flex;
  line-height: 30px;
  align-items: center;
  justify-content: space-between;
  ${p =>
    p.type === 'access' &&
    `
    padding-left: 20px;
  `};
`;

export const SharedListContactText = styled.div`
  width: ${p => (p.width ? p.width : 'auto')};
  color: ${p => (p.color ? p.color : '#4A4A4A')};
  cursor: ${p => (p.cursor ? p.cursor : 'unset')};
  font-size: ${p => (p.fontSize ? p.fontSize : '14px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
`;

export const SharedListContactCard = SharedListFlexItem.extend`
  padding: 10px 0px 0px 0px;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  min-height: 7vh;
  align-items: center;
  padding: 0px 30px 30px 30px;
  justify-content: space-between;
`;

export const TitleLeftContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const TitleRightContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: space-between;
`;

export const SearchAndStats = styled.div`
  display: flex;
  flex-shrink: 0;
  min-height: 10vh;
  align-items: flex-start;
  padding: 0px 30px 30px 30px;
  justify-content: space-between;
`;

export const SearchBar = styled.div`
  display: flex;
  flex-shrink: 0;
  cursor: pointer;
  line-height: 20px;
  align-items: center;
  justify-content: center;
`;

export const StyledImg = styled.img`
  width: ${p => (p.width ? p.width : '15px')};
  height: ${p => (p.height ? p.height : '15px')};
  padding-right: ${p => (p.padding === 'right' ? '5px' : '0px')};
`;

export const SearchInput = styled.input`
  width: 40%;
  border: none;
  outline: none;
  color: #a4a8aa;
  font-size: 14px;
  line-height: 20px;
  background: transparent;
`;

export const StatsContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
`;

export const StatBox = styled.div`
  height: 90px;
  width: 100px;
  display: flex;
  flex-shrink: 0;
  cursor: pointer;
  margin-right: 2px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #e5ecf1;
  background-color: ${p => (p.bgColor ? p.bgColor : 'transparent')};
`;

export const VouchersListContainer = styled.div`
  padding: 0px;
  display: flex;
  flex-shrink: 0;
  min-height: 50vh;
  flex-direction: column;
`;

export const VouchersList = styled.div`
  display: flex;
  flex-shrink: 0;
  height: inherit;
  min-height: 50vh;
  padding: 0px 30px;
  flex-direction: column;
  ${p =>
    p.type === 'empty'
      ? `
    align-items: center;
    justify-content: center;
  `
      : `
    align-items: flex-start;
    justify-content: flex-start;
  `};
`;

export const VouchersListHeader = styled.div`
  width: 100%;
  display: flex;
  line-height: 30px;
  align-items: center;
  justify-content: flex-start;
  padding-top: ${p => (p.paddingTop ? p.paddingTop : '0px')};
`;

export const CellContent = styled.div`
  word-break: break-all;
  border-bottom: 1px solid #868686;
  width: ${p => (p.width ? p.width : 'auto')};
  color: ${p => (p.color ? p.color : '#000000')};
  font-size: ${p => (p.fontSize ? p.fontSize : '16px')};
  text-align: ${p => (p.textalign ? p.textalign : 'start')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
  padding-top: ${p => (p.paddingTop ? p.paddingTop : '0px')};
`;

export const ListItemsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  aling-items: flex-start;
  justify-content: flex-start;
`;

export const ListItem = styled.div`
  width: 100%;
  display: flex;
  flex-shrink: 0;
  padding: 15px 0px;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const ItemCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${p => (p.width ? p.width : 'auto')};
  align-items: ${p => (p.textalign ? p.textalign : 'flex-start')};
`;

export const ItemCellContent = styled.div`
  word-break: break-all;
  width: ${p => (p.width ? p.width : 'auto')};
  height: ${p => (p.height ? p.height : 'unset')};
  color: ${p => (p.color ? p.color : '#000000')};
  cursor: ${p => (p.cursor ? p.cursor : 'default')};
  font-size: ${p => (p.fontSize ? p.fontSize : '16px')};
  text-align: ${p => (p.textalign ? p.textalign : 'start')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
  padding-top: ${p => (p.paddingTop ? p.paddingTop : '0px')};
  padding-left: ${p => (p.paddingLeft ? p.paddingLeft : '0px')};
`;

export const LinkText = styled(Link)`
  word-break: break-all;
  width: ${p => (p.width ? p.width : 'auto')};
  color: ${p => (p.color ? p.color : '#000000')};
  cursor: ${p => (p.cursor ? p.cursor : 'default')};
  font-size: ${p => (p.fontSize ? p.fontSize : '16px')};
  text-align: ${p => (p.textalign ? p.textalign : 'start')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '400')};
`;

export const VoucherListOptions = styled.div`
  width: 100%;
  display: flex;
  line-height: 30px;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #868686;
`;

export const VerifiedByList = styled.div`
  display: flex;
  aling-items: ${p => (p.alignItems ? p.alignItems : 'flex-start')};
  flex-direction: ${p => (p.flexDirection ? p.flexDirection : 'column')};
  justify-content: ${p => (p.justifyContent ? p.justifyContent : 'space-between')};
`;
