import styled from 'styled-components';
import { ThemeDefaultValues } from '../../../ThemeProvider';
const Container = styled.div``;

const Name = styled.div`
  font-size: 1.1rem;
  font-family: roboto regular;
`;

const Address = styled.div`
  color: #b4b4b4;
  width: 200px;
  margin-top: 5px;
  text-overflow: ellipsis;
  font-size: 0.9rem;
`;

const CurrentBalance = styled.div`
  display: flex;
  color: #b4b4b4;
  justify-content: space-between;
  padding: 5px 0px 15px 0px;
  font-size: 0.9rem;
  font-style: italic;
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  background-color: ${ThemeDefaultValues.cardBackgroundColor};
  align-items: center;
  justify-content: space-between;
`;

//TODO: just hot fix for demo should not use padding to align.
// use flexbox or gird to construct layout
const Description = styled.div`
  padding-right: 0rem;
`;

//WARNING: css margin hard coded for presentation//
const ImageHolder = styled.img`
  cursor: pointer;
  background: transparent;
  ${p => (p.padding ? `padding: ${p.padding}` : 'padding:5px')};
  width: ${p => (p.width ? p.width : '14px')};
  height: ${p => (p.height ? p.height : '14px')};
  position: ${p => (p.position ? p.position : null)};
  top: ${p => (p.top ? p.top : null)};
  left: ${p => (p.left ? p.left : null)};
`;

const PartyPickerStyle = styled.div`
  width: 100%;
`;

export default {
  Address,
  Container,
  CurrentBalance,
  Description,
  Details,
  ImageHolder,
  Name,
  PartyPickerStyle
};
