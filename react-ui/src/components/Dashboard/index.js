import styled from 'styled-components';
import { FlexCenter } from '..';

export const HeaderItems = styled.div`
  display: flex;
  width: inherit;
  align-items: center;
  justify-content: space-between;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  text-decoration: none;
  justify-content: flex-start;
  background-color: transparent;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
`;

export const ListAnchror = styled.div`
  color: #868686;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  padding: 20px 16px;
  text-decoration: none;
  font-family: 'Dax Regular';
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  border-bottom: ${props =>
    props.active === true ? '5px solid #26D367' : '5px solid transparent'};
`;

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #f4f5f7;
`;

export const ContentSection = FlexCenter.extend`
  width: auto;
  padding: ${p => (p.padding ? p.padding : '30px')};
  height: calc(100vh - 126px);
`;

export const StyledImg = styled.img`
  width: ${p => (p.width ? p.width : '15px')};
  height: ${p => (p.height ? p.height : '15px')};
`;

export const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledSpan = styled.span`
  display: flex;
  cursor: default;
  align-items: center;
  justify-content: space-between;
  width: ${p => (p.width ? p.width : 'fit-content')};
  padding-left: ${p => (p.paddingLeft ? p.paddingLeft : '0px')};
`;
