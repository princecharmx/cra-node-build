import styled from 'styled-components';
import { FlexCenter } from '../';

export const ContentSection = FlexCenter.extend`
  width: 100%;
  height: calc(100vh - 64px);
`;

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #838383;
`;

export const ContentContainer = styled.div`
  width: 400px;
  height: 80vh;
  background: #ffffff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
`;

export const Description = styled.div`
  font-size: 18px;
  font-weight: 600;
  padding: 30px 0px;
  color: #b2adad;
  text-align: center;
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const StyledImg = styled.img`
  background-color: transparent;
  cursor: pointer;
  width: ${props => (props.width ? props.width : '15px')};
  height: ${props => (props.height ? props.height : '15px')};
`;

export const OTPContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const ResendOTP = styled.span`
  color: #27d466;
  cursor: pointer;
  font-size: 12px;
  font-weight: 400;
  margin-top: 10px;
  text-align: right;
`;
