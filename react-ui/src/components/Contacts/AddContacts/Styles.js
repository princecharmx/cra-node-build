import styled from 'styled-components';

export const Container = styled.div`
  height: calc(100% - 61px);
  overflow-y: scroll;
`;

export const Fields = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${p => {
    switch (p.type) {
      case 'LeftPadding':
        return '15px 30px 15px 30px';
      case 'TopPadding':
        return '40px 30px 0px 15px';
      default:
        return '30px 30px 0px 30px';
    }
  }};
`;

export const SecondaryContacts = styled.div`
  color: #428bca;
  padding: ${p => (p.type === 'message' ? `0px 30px 0px 30px` : `0px 0px 0px 30px`)};
  &: hover {
    cursor: pointer;
    width: fit-content;
  }
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
  ${p =>
    p.type === 'message' &&
    `
    width: 500px;
    white-space: nowrap;
    border-radius: 10px;
  `};
`;

export const HorizontalFields = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 35px 30px 0px 30px;
  justify-content: space-between;
`;

export const Label = styled.label`
  display: table;
  margin: auto;
  color: #428bca;
  padding-top: 15px;
  padding-right: 10px;
`;

export const TabsBackground = styled.div`
  height: 30px;
  margin-top: 30px;
  background: #f5f5f5;
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: white;
  justify-content: center;
  margin: 30px 0px 30px 0px;
`;

export const DeleteBox = styled.div`
  color: #868686;
  margin-top: auto;
  font-weight: 12px;
  cursor: ${p => (p.disable === 'true' ? `not-allowed` : `pointer`)};
  ${p => p.display === 'none' && `display: none;`};
  ${p => p.type === 'padding' && `padding-left: 30px;`};
`;

export const SecondaryContactsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`;

export const Card = styled.div`
  width: auto;
  height: 30px;
  display: flex;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  width: ${p => (p.width ? p.width : 'auto')};
  background-color: ${p => (p.bgcolor ? p.bgcolor : 'white')};
  ${p =>
    p.type === 'buttons' &&
    `
    margin-left: 10px;
  `};
`;

export const MessageBox = styled.div`
  height: 30px;
  display: flex;
  border-radius: 5px;
  align-items: center;
  width: ${p => (p.width ? p.width : 'auto')};
  background-color: ${p => (p.bgcolor ? p.bgcolor : 'white')};
  ${p =>
    p.type === 'buttons' &&
    `
    margin-left: 10px;
  `};
`;

export const Message = styled.div`
  width: ${p => (p.width ? p.width : 'auto')};
  color: ${p => (p.color ? p.color : '#000000')};
  font-size: ${p => (p.fontsize ? p.fontsize : '14px')};
  font-weight: ${p => (p.fontweight ? p.fontweight : '400')};
  ${p =>
    p.padding === 'leftright' &&
    `
    padding: 0px 10px;
  `} ${p =>
      p.type === 'button' &&
      `
    margin-left: 10px;
    cursor: pointer;
  `};
`;
