import React from 'react';
import styled from 'styled-components';
import { ThemeDefaultValues } from '../ThemeProvider';

import {
  TextField,
  FlatButton,
  DatePicker,
  SelectField,
  AutoComplete,
  DropDownMenu
} from 'material-ui';

const itemStyles = {
  itemInput: {
    height: '30px',
    border: 'none',
    outline: 'none',
    marginTop: '5px',
    fontSize: '14px',
    overflow: 'hidden',
    position: 'relative',
    whiteSpace: 'nowrap',
    fontFamily: ThemeDefaultValues.baseFontFamily,
    textOverflow: 'ellipsis',
    width: 'calc(100% - 5px)',
    color: 'rgba(0, 0, 0, 0.87)',
    ':focus': {
      borderBottom: 'none #f5f5f5',
      boxShadow: 'none'
    }
  },
  itemInputLineStyle: {
    bottom: '5px',
    width: '100%',
    margin: '0px',
    position: 'relative',
    boxSizing: 'content-box',
    borderTop: 'none #f5f5f5',
    borderLeft: 'none #f5f5f5',
    borderRight: 'none #f5f5f5',
    borderBottom: '1px solid #f5f5f5',
    ':focus': {
      borderBottom: 'none #f5f5f5',
      boxShadow: 'none'
    }
  },
  itemInputContainerStyle: {
    width: '100%',
    height: '30px',
    cursor: 'auto',
    position: 'relative',
    display: 'inline-block',
    backgroundColor: 'transparent',
    transition: 'height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    ':focus': {
      borderBottom: 'none #f5f5f5',
      boxShadow: 'none'
    }
  },
  inputHintStyle: {
    bottom: '-2px',
    fontSize: '14px',
    width: 'inherit',
    textAlign: 'center',
    position: 'absolute',
    color: 'rgba(0, 0, 0, 0.3)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  dropdownIconStyle: {
    top: '3px',
    right: '-5px',
    border: '0px',
    height: '30px',
    padding: '0px',
    outline: 'none',
    fontSize: '0px',
    cursor: 'pointer',
    background: 'none',
    userSelect: 'none',
    textAlign: 'right',
    overflow: 'visible',
    position: 'absolute',
    fontWeight: 'inherit',
    textDecoration: 'none',
    boxSizing: 'border-box',
    display: 'inline-block',
    fill: 'rgb(224, 224, 224)',
    color: 'rgb(224, 224, 224)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  dropdownStyle: {
    height: '30px',
    display: 'inline-block',
    fontSize: '14px',

    outline: 'none',
    position: 'relative',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  dropdownUnderlineStyle: {
    bottom: '0px',
    width: 'inherit',
    margin: '0px',
    position: 'relative',
    boxSizing: 'content-box',
    borderTop: 'none #f5f5f5',
    borderLeft: 'none #f5f5f5',
    borderRight: 'none #f5f5f5',
    borderBottom: '1px solid #f5f5f5',
    ':focus': {
      borderBottom: 'none #f5f5f5',
      boxShadow: 'none'
    }
  },
  dropdownMenuStyle: {
    width: 'inherit',
    padding: '0px',
    position: 'relative',
    boxSizing: 'border-box'
  },
  dropdownMenuItemStyle: {
    width: 'inherit',
    fontSize: '14px',
    boxSizing: 'border-box',

    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(255, 255, 255)',
    transition:
      'transform 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  dropdownLabelStyle: {
    top: '5px',
    height: '30px',
    width: 'inherit',
    overflow: 'hidden',
    lineHeight: '30px',
    paddingLeft: '0px',
    textAlign: 'center',
    paddingRight: '0px',
    position: 'relative',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: 'rgba(0, 0, 0, 0.87)'
  },
  flatButtonStyle: {
    border: '10px',
    height: 'unset',
    fontSize: '14px',
    fontWeight: '400',
    cursor: 'pointer',
    minWidth: 'unset',
    transition: 'none',
    lineHeight: 'unset',
    textAlign: 'center',
    textDecoration: 'none',

    backgroundColor: 'transparent',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
  },
  flatButtonLabelStyle: {
    fontSize: 'inherit',
    paddingLeft: 'unset',
    paddingRight: 'unset',
    textTransform: 'none',
    fontWeight: 'inherit'
  }
};

const itemDescriptionStyles = {
  itemInput: {
    height: '30px',
    color: 'blue',
    border: 'none',
    outline: 'none',
    marginTop: '5px',
    fontSize: '14px',
    overflow: 'hidden',
    position: 'relative',
    whiteSpace: 'nowrap',

    textOverflow: 'ellipsis',
    width: 'calc(100% - 5px)',
    ':focus': {
      borderBottom: 'none #f5f5f5',
      boxShadow: 'none'
    }
  },
  itemInputLineStyle: {
    bottom: 'none',
    width: '100%',
    margin: '0px',
    position: 'relative',
    boxSizing: 'content-box',
    borderTop: 'none #f5f5f5',
    borderLeft: 'none #f5f5f5',
    borderRight: 'none #f5f5f5',
    borderBottom: 'none #f5f5f5',
    ':focus': {
      borderBottom: 'none #f5f5f5',
      boxShadow: 'none'
    }
  },
  itemInputContainerStyle: {
    width: '100%',
    height: '30px',
    cursor: 'auto',
    position: 'relative',
    display: 'inline-block',
    backgroundColor: 'transparent',
    transition: 'height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    ':focus': {
      borderBottom: 'none #f5f5f5',
      boxShadow: 'none'
    }
  }
};

const Img = styled.img`
  padding-top: 5px;
  padding-right: 10px;
  width: ${props => (props.iconWidth ? props.iconWidth : '20px')};
  height: ${props => (props.iconHeight ? props.iconHeight : '20px')};
`;

const StyledSpan = styled.span`
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ItemSpan = styled.span`
  height: ${props => (props.height ? props.height : '58px')};
  width: ${props => (props.width ? props.width : 'initial')};
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ImageHolder = styled.img`
  background-color: transparent;
  width: ${props => (props.width ? props.width : '30px')};
  height: ${props => (props.height ? props.height : '30px')};
  ${props => (props.type === 'empty' ? `margin-bottom: 20px;` : `background-color: transparent;`)};
  cursor: ${props => (props.disable === 'true' ? 'not-allowed' : 'pointer')};
`;

const ItemAutoComplete = ({
  hint,
  width,
  height,
  onFocus,
  inputRef,
  searchText,
  dataSource,
  onUpdateInput,
  maxSearchResults,
  id
}) => (
  <ItemSpan height={height} width={width}>
    <AutoComplete
      openOnFocus={true}
      ref={inputRef}
      hintText={hint}
      onFocus={onFocus}
      filter={AutoComplete.fuzzyFilter}
      dataSource={dataSource}
      searchText={searchText}
      id={id || 'auto-complete'}
      onUpdateInput={onUpdateInput}
      maxSearchResults={maxSearchResults || 5}
      style={itemStyles.itemInputContainerStyle}
      listStyle={{ fontFamily: 'roboto regular', fontSize: '14px' }}
      underlineStyle={{ ...itemStyles.dropdownUnderlineStyle, bottom: '4px' }}
      hintStyle={{
        ...itemStyles.inputHintStyle,
        bottom: '2px',
        textAlign: 'normal'
      }}
      textFieldStyle={{
        width: 'inherit',
        fontFamily: 'roboto regular',
        fontSize: '14px',
        height: '30px',
        textAlign: 'none',
        marginTop: '4px'
      }}
    />
  </ItemSpan>
);

const ItemDropdown = ({ children, value, width, onChange, onFocus, id }) => (
  <DropDownMenu
    id={id}
    value={value}
    onFocus={onFocus}
    autoWidth={false}
    iconStyle={itemStyles.dropdownIconStyle}
    menuStyle={itemStyles.dropdownMenuStyle}
    labelStyle={itemStyles.dropdownLabelStyle}
    menuItemStyle={itemStyles.dropdownMenuItemStyle}
    underlineStyle={itemStyles.dropdownUnderlineStyle}
    onChange={(event, index, v) => onChange(v)}
    style={{ ...itemStyles.dropdownStyle, width }}
  >
    {children}
  </DropDownMenu>
);

const ItemTextInput = ({
  isInputDescription,
  inputHeight,
  field,
  onChange,
  value,
  type,
  onBlur,
  onFocus,
  id,
  page,
  onKeyUp,
  containerHeight,
  containerWidth,
  hint,
  readOnly
}) => {
  const style = isInputDescription ? itemDescriptionStyles : itemStyles;
  return (
    <ItemSpan height={containerHeight || 'unset'} width={containerWidth}>
      <TextField
        id={id || ''}
        value={value}
        onBlur={onBlur}
        hintText={hint}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        type={type || 'text'}
        underlineStyle={style.itemInputLineStyle}
        readOnly={readOnly === true ? 'readonly' : false}
        onChange={event => onChange(event.target.value || '')}
        inputStyle={{
          ...style.itemInput,
          textAlign: field === 'name' ? 'none' : 'center'
        }}
        hintStyle={{
          ...style.inputHintStyle,
          textAlign: field === 'name' ? 'none' : 'center'
        }}
        style={{
          ...style.itemInputContainerStyle,
          marginTop: page === 'showNote' ? '-10px' : 'initial'
        }}
      />
    </ItemSpan>
  );
};

const TextInputField = ({
  id,
  type,
  hint,
  width,
  value,
  imgSrc,
  onBlur,
  onKeyUp,
  onFocus,
  onChange,
  readOnly,
  autoFocus,
  errorText,
  inputRef,
  iconHeight,
  iconWidth,
  underline,
  labelText,
  labelFixed,
  tabIndex,
  textColor,
  labelSize,
  disabled
}) => (
  <StyledSpan>
    {imgSrc && <Img src={imgSrc} iconHeight={iconHeight} iconWidth={iconWidth} />}
    <TextField
      id={id || ''}
      value={value}
      hintText={hint}
      ref={inputRef}
      onBlur={onBlur}
      autoFocus={autoFocus === 'true' ? true : false}
      onKeyUp={onKeyUp}
      onFocus={onFocus}
      floatingLabelFixed={labelFixed}
      underlineShow={underline}
      type={type || 'text'}
      errorText={errorText || ''}
      floatingLabelText={labelText}
      textareaStyle={{ width: width }}
      disabled={disabled}
      floatingLabelStyle={{ size: labelSize, color: textColor }}
      readOnly={readOnly === true ? 'readonly' : false}
      onChange={event => onChange(event.target.value || '')}
      style={{ width: width, marginTop: '-14px', fontFamily: 'roboto regular' }}
    />
  </StyledSpan>
);

const Dropdown = ({
  imgSrc,
  labelSize,
  width,
  hint,
  labelText,
  iconWidth,
  iconHeight,
  onChange,
  value,
  disable,
  inputRef,
  children,
  errorText
}) => (
  <StyledSpan>
    {imgSrc && <Img src={imgSrc} iconHeight={iconHeight} iconWidth={iconWidth} />}
    <SelectField
      value={value}
      autoWidth={false}
      ref={inputRef}
      disabled={disable}
      errorText={errorText || ''}
      floatingLabelText={labelText}
      floatingLabelStyle={{ size: labelSize }}
      onChange={(event, index, value) => onChange(value)}
      style={{ width: width, marginTop: '-14px', fontFamily: 'roboto regular' }}
    >
      {children}
    </SelectField>
  </StyledSpan>
);
const date = new Date();
const DateTime = ({
  hint,
  value,
  width,
  maxDate,
  onChange,
  underline,
  labelText,
  inputRef,
  onKeyUp,
  marginOnTop,
  id
}) => (
  <DatePicker
    autoOk={true}
    value={value || date}
    hintText={hint}
    ref={inputRef}
    onKeyUp={onKeyUp}
    container="inline"
    id={id || 'uniqueId'}
    underlineShow={underline}
    floatingLabelText={labelText}
    maxDate={maxDate || new Date()}
    onChange={(event, date) => onChange(date)}
    textFieldStyle={{
      width: 'inherit',
      fontSize: '14px',
      color: '#428bca',
      cursor: 'pointer'
    }}
    style={{
      width: width,
      color: '#428bca',
      marginTop: marginOnTop || '-14px',

      fontSize: '13px'
    }}
  />
);

const AutoFillInput = ({
  hint,
  width,
  labelText,
  searchText,
  dataSource,
  onUpdateInput,
  errorText,
  maxSearchResults
}) => (
  <AutoComplete
    openOnFocus={true}
    hintText={hint}
    dataSource={dataSource}
    searchText={searchText}
    floatingLabelText={labelText}
    onUpdateInput={onUpdateInput}
    filter={AutoComplete.fuzzyFilter}
    maxSearchResults={3}
    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
    listStyle={{ width: width, fontFamily: 'Dax Regular' }}
    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
    style={{ width: width, marginTop: '-14px', fontFamily: 'roboto regular' }}
    textFieldStyle={{
      width: 'inherit',

      fontSize: '14px'
    }}
    errorText={errorText}
  />
);

const TextButton = ({ label, onClick, color }) => (
  <FlatButton
    label={label}
    onClick={onClick}
    style={itemStyles.flatButtonStyle}
    labelStyle={{ ...itemStyles.flatButtonLabelStyle, color: color }}
  />
);

export {
  Dropdown,
  DateTime,
  TextButton,
  ImageHolder,
  ItemDropdown,
  ItemTextInput,
  AutoFillInput,
  TextInputField,
  ItemAutoComplete
};
