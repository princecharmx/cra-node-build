import React from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

const toggleStyles = {
  container: {
    display: 'flex',
    width: '160px',
    justifyContent: 'space-between'
  },
  drContiner: {
    paddingLeft: '10px'
  }
};

const toggleDiscountUnitStyles = {
  container: {
    display: 'flex',
    width: '10rem',
    paddingLeft: '0.625rem',
    marginTop: '1rem'
  },
  discountContiner: {
    paddingLeft: '0.625rem'
  }
};
const Toggle = ({ onClick, checked }) => (
  <RadioButtonGroup
    name="shipSpeed"
    valueSelected={checked ? 'Dr' : 'Cr'}
    style={toggleStyles.container}
    onChange={() => onClick()}
  >
    <RadioButton value="Cr" label="Credit" />
    <RadioButton value="Dr" label="Debit" style={toggleStyles.drContiner} />
  </RadioButtonGroup>
);

const ToggleForDiscountUnit = ({ onClick, checked }) => (
  <RadioButtonGroup
    name="shipSpeed"
    defaultSelected="%"
    style={toggleDiscountUnitStyles.container}
    onChange={() => onClick()}
  >
    <RadioButton value="%" label="%" iconStyle={{ height: '1.125rem' }} />
    <RadioButton
      value="Rupees"
      label="Rs"
      iconStyle={{ height: '1.125rem' }}
      style={toggleDiscountUnitStyles.discountContiner}
    />
  </RadioButtonGroup>
);
export { Toggle, ToggleForDiscountUnit };
