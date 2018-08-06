import styled from 'styled-components';
import { Button } from '../../AppStyledComponents';

export const ButtonExtended = Button.extend`
  ${props =>
    props.type === 'empty' &&
    `
    margin: 20px 0px;
  `};
`;

export const Img = styled.img`
  height: 14px;
  width: 14px;
  position:relative;
  left:10px;
  disable: ${p => (p.disable === 'true' ? true : false)}
  padding-bottom: 4px;
  &: hover {
    cursor: pointer;
  }
`;

export const SubContainer = styled.div`
  width: 150px;
  display: flex;
  justify-content: space-between;
`;

export const cardStyles = {
  card: {
    height: '30%'
  },

  cardHeader: {
    paddingBottom: '0px',
    backgroundColor: 'rgb(255, 254, 254)'
  },

  cardTitle: {
    fontSize: '20px',
    fontWeight: '200',
    paddingTop: '5px'
  }
};

export const Block = styled.div`
  display: flex;
  width: 400px;
`;

export const Label = styled.div`
  margin-top: 15px;
  font-size: 15px;
  font-weight: 200;
`;

export const HorizontalTwoFeilds = styled.div`
  display: flex;
  padding-top: ${p => (p.type === 'paddingTop' ? '30px' : '10px')};
  padding-left: ${p => (p.type === 'paddingTop' ? '5px' : '0px')};
  ${p => p.flexEnd === 'flexEnd' && `jusitify-content: flex-end`} margin-left: 25px;
  align-items: center;
  width: calc(100% - 30px);
  justify-content: space-between;
`;

export const HorizontalBlockSingal = styled.div`
  display: flex;
  padding-top: ${p => (p.type === 'paddingTop' ? '30px' : '10px')};
  padding-left: ${p => (p.type === 'paddingTop' ? '5px' : '0px')};
  ${p => p.flexEnd === 'flexEnd' && `jusitify-content: flex-end`} margin-left: 25px;
  align-items: center;
  width: calc(100% - 30px);
  justify-content: flex-end;
`;

export const styles = {
  setHeight: {
    height: '190px'
  },
  Onscroll: {
    overflowY: 'scroll',
    maxHeight: '190px'
  }
};

export const SingleRowPopUp = styled.div`
  display: flex;
  width: inherit;
  align-items: center;
  justify-content: center;
  ${p => (p.type === 'lastRow' ? ` margin: 0px; ` : ` margin: 10px 0px; `)};
`;

export const MarginRow = styled.div`
  margin: 15px 0px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 5px 5px 5px;
  justify-content: space-between;
  border-bottom: 1px solid #ddcfcf;
`;

export const HeaderTitle = styled.div`
  width: 120px;
  display: flex;
  display: header;
  justify-content: space-around;
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 400;
  width: 80px;
  word-wrap: break-word;
`;

export const Avatar = styled.img`
  height: 30px;
  weight: 30px;
`;

export const CancelIcon = styled.img`
  height: 15px;
  cursor: pointer;
  padding-right: 5px;
  padding-bottom: 5px;
`;
