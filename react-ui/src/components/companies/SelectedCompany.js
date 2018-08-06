import styled from 'styled-components';
export const ContentContainer = styled.div`
  height: 80vh;
  width: 400px;
  background: #ffffff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.2);
`;

export const PasswordScreen = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  justify-content: space-evenly;
`;

export const StyledImg = styled.img`
  background-color: transparent;
  width: ${props => (props.width ? props.width : '15px')};
  height: ${props => (props.height ? props.height : '15px')};
`;

export const Description = styled.div`
  font-size: 18px;
  font-weight: 600;
  padding: 30px 0px;
  color: #b2adad;
  text-align: center;
`;
