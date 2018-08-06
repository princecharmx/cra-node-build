import styled from 'styled-components';
import { ThemeDefaultValues } from '../../ThemeProvider';
export const Form = styled.div`
  width: 100%;
  display: flex;
  overflow: scroll;
  flex-direction: column;
  align-items: flex-start;
  min-height: calc(100% - 61px);
  justify-content: flex-start;
`;

export const FormRow = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  ${props => {
    switch (props.type) {
      case 'thirdRow':
      case 'fourthRow':
      case 'secondRow':
        return `
          min-height: unset;
          margin-top: 30px;
        `;
      case 'firstRow':
      default:
        return `
          min-height: unset;
        `;
    }
  }};
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
  font-family: 'roboto';
  color: ${p => (p.color ? p.color : ThemeDefaultValues.tabFontColor)};
  font-size: ${p => (p.fontSize ? p.fontSize : ThemeDefaultValues.tabFontSize)};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : ThemeDefaultValues.tabFontWeight)};
`;

export const Fields = styled.div`
  display: flex;
  padding-left: ${p => (p.type === 'noLeftPadding' ? '0px' : '30px')};
  padding-top: ${p => (p.paddingTop ? p.paddingTop : '0px')};
  flex-direction: column;
  align-items: center;
  margin-top: 6px;
  justify-content: space-between;
  ${props =>
    props.type === 'secondRow'
      ? `
    padding-right: 30px;
    width: calc(100% - 60px);
  `
      : `
    width: calc(100% - 30px);
  `};
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

export const BusinessAccountAddress = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 400;
  justify-content: center;
  font-family: 'Roboto';
`;

export const FieldsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const StyledImg = styled.img`
  display: none;
  padding-bottom: 4px;
  background-color: transparent;
  width: ${props => (props.width ? props.width : '15px')};
  height: ${props => (props.height ? props.height : '15px')};
  cursor: ${props => (props.disable === 'true' ? 'not-allowed' : 'pointer')};
`;

export const HorizontalFields = styled.div`
  height: 30px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  flex-direction: row;
  margin-left: ${p => (p.type === 'noMargin' ? '0px' : '30px')};
  width: ${p => (p.width ? `calc(100% - ${p.width})` : `calc(100% - 30px)`)};
  justify-content: ${p => (p.type === 'spaceBetween' ? `space-between` : `flex-start`)};
  padding-top: ${p => (p.paddingTop ? p.paddingTop : '0px')};
  margin-top: ${p => (p.type === 'header' ? '10px' : '0px')};
  &:hover ${StyledImg} {
    display: ${p => (p.type === 'values' ? 'block' : 'none')};
  }
  ${p => p.type === 'values' && 'margin-bottom: 5px; margin-top: 5px;'};
`;

export const ItemHeader = styled.div`
  display: flex;
  min-height: 30px;
  font-family: 'Roboto regular';
  width: ${p => (p.width ? p.width : '50px')};
  height: ${p => (p.height ? p.height : '30px')};
  color: ${p => (p.color ? p.color : '#868686')};
  font-size: ${p => (p.fontSize ? p.fontSize : '12px')};
  font-weight: ${p => (p.fontWeight ? p.fontWeight : '500')};
  align-items: ${p => (p.textAlign === 'start' ? 'start' : 'center')};
  justify-content: ${p => (p.type === 'name' ? 'flex-start' : 'center')};
  border-bottom: ${p => (p.container === 'icon' ? '1px solid transparent' : '1px solid #f5f5f5')};
  ${p =>
    p.type === 'icon'
      ? `
    align-items: flex-end;
    justify-content: center;
  `
      : `
    align-items: center;
  `};
`;

export const AddItemText = styled.span`
  display: ${p => (p.addLineBtnVisibility === 'true' ? `block` : `none`)};
  color: ${p => (p.type === 'text' ? '#000000' : '#2400ff')};
  font-size: 0.875rem;
  width: 100%;
  white-space: nowrap;
  font-family: roboto regular;
  cursor: pointer;
  font-weight: 400;
  margin-top: ${p => (p.type === 'text' ? '16px' : '30px')};
`;

export const SummaryBlock = HorizontalBlock.extend`
  justify-content: flex-start;
  height: ${p => (p.height ? p.height : '20px')};
  padding-top: ${p => (p.paddingTop ? p.paddingTop : '0px')};
  align-items: ${p => (p.alingItems ? p.alingItems : 'center')};
  margin-bottom: ${p => (p.marginBottom ? p.marginBottom : '10px')};
  padding-bottom: ${p => (p.paddingBottom ? p.paddingBottom : '0px')};
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
  margin-top: 1.25rem;
  font-family: 'roboto';
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
  font-family: 'roboto';
  text-align: right;
  margin-right: 4rem;
  margin-top: 1.25rem;
  ${p =>
    p.itemType === 'narration' &&
    `
    margin-top: 10px;
    margin-bottom: 10px;
    width: calc(100% - 60px);
  `};
`;

export const SummarySubTitle = styled.div`
  width: 100%;
  color: #0d5ae6;
  font-style: italic;
  cursor: pointer;
  font-size: 0.75rem;
  margin-top: 0.625rem;
`;

export const SingleRow = styled.div`
  display: flex;
  width: inherit;
  align-items: center;
  justify-content: center;
  ${p => (p.type === 'lastRow' ? ` margin: 0px; ` : ` margin: 30px 0px; `)};
`;
