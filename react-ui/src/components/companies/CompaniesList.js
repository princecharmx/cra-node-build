import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FlexCenter } from '..';

export const ContentSection = FlexCenter.extend`
  width: auto;
  height: calc(100vh - 64px);
`;

export const ContentContainer = styled.div`
  width: 400px;
  height: 80vh;
  background: #ffffff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
`;

export const CompanyName = styled.div`
  display: flex;
  color: #000000;
  font-size: 18px;
  font-weight: 400;
  flex-direction: row;
`;

export const StyledSpanContainer = styled.span`
  height: 25px;
  display: flex;
  margin-left: 15px;
  width: fit-content;
  align-items: center;
  border-radius: 10px;
  justify-content: center;
  background-color: #ededed;
`;

export const StyledSpan = styled.span`
  color: #696969;
  font-size: 12px;
  font-weight: 400;
  padding: 0px 10px;
  width: fit-content;
`;

export const CompanyAddress = styled.div`
  color: #b2adad;
  font-size: 14px;
  font-weight: 400;
  padding-top: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Content = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const StyledImg = styled.img`
  background-color: transparent;
  width: ${p => (p.width ? p.width : '15px')};
  height: ${p => (p.height ? p.height : '15px')};
  ${p =>
    p.type !== 'empty' &&
    `
    border-radius: 50%;
  `};
`;

export const Card = styled.div`
  display: flex;
  padding: 0px 20px;
  align-items: center;
  width: calc(100% - 40px);
  justify-content: space-between;
  min-height: ${p => (p.type === 'company' ? '75px' : '49px')};
  cursor: ${p => (p.title === 'header' ? 'default' : 'pointer')};
  background-color: ${p => (p.title === 'header' ? '#fafafa' : '#ffffff')};
  box-shadow: ${p => (p.title === 'header' ? '0 0 12px 0 rgba(0, 0, 0, .2)' : 'none')};
  border-bottom: ${p => (p.title === 'header' ? 'none' : '1px solid hsla(222, 5%, 52%, .15)')};
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  ${p =>
    p.type === 'add' &&
    `
    height: 20px;
  `};
`;

export const Description = styled.div`
  font-size: 18px;
  font-weight: 600;
  padding: 30px 0px;
  color: #b2adad;
  text-align: center;
`;

export const List = styled.div`
  width: 100%;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  height: calc(100% - 50px);
  ${p =>
    p.type === 'empty'
      ? `
    align-items: center;
    justify-content: center;
  `
      : `
    overflow: scroll;
    align-items: flex-start;
    justify-content: flex-start;
  `};
`;
