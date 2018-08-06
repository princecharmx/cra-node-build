import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ThemeDefaultValues } from '../ThemeProvider';
export const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderItem = styled.div`
  font-weight: 600;
  font-family: ${ThemeDefaultValues.baseFontFamily};
  font-size: ${props => (props.type ? '22px' : '18px')};
  color: ${props => (props.type ? '#ffffff' : '#d5f0eb')};
  cursor: ${props => (props.type ? 'default' : 'pointer')};
`;

export const LoaderContainer = FlexCenter.extend`
  width: 100%;
  height: 60vh;
`;

export const Button = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => (props.height ? props.height : '40px')};
  width: ${props => (props.width ? props.width : '150px')};
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
  border-radius: 100px;
  text-align: center;
  text-decoration: none;
  background-color: #27d466;
  border: 1px solid #27d466;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 600ms cubic-bezier(0.165, 0.84, 0.44, 1);
  margin-top: ${props => (props.margintop ? props.margintop : '30px')};
  &:hover {
    box-shadow: none;
    transition: box-shadow 600ms none;
  }
`;

export const ImageHolder = styled.img`
  cursor: pointer;
  background: transparent;
  color: #868686;
  width: ${p => (p.width ? p.width : '20px')};
  height: ${p => (p.height ? p.height : '20px')};
  position: ${p => (p.position ? p.position : null)};
  top: ${p => (p.top ? p.top : null)};
  left: ${p => (p.left ? p.left : null)};
`;

export const Image = styled.img``;
