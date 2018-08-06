import React from 'react';
import { RadioButton, RadioButtonGroup, MuiThemeProvider } from 'material-ui';

const ReturnAdjust = ({ onSelect }) => (
  <MuiThemeProvider>
    <RadioButtonGroup
      style={{ display: 'flex', width: '500px' }}
      defaultSelected="return"
      onChange={event => onSelect(event.target.value)}
    >
      <RadioButton value="return" label="Return" />
      <RadioButton value="adjustment" label="Adjustment" />
    </RadioButtonGroup>
  </MuiThemeProvider>
);

export { ReturnAdjust };
