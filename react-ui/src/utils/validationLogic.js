export const onlyNumber = /^\d+$/;
export const requiredField = /^.{1,}$/;
export const phoneRegEx = /^(\+\d{1,3}[- ]?)?\d{10}$/;
export const validateField = (value, regex, errMsg) => {
  if (!regex.test(value)) {
    return errMsg;
  }
  return '';
};

let errors = {};
let validatorFormRules = null;

/**
 * sets validation rules defined in the form
 * initialized from form logic handler component
 * @param {*} rules
 */
export const setValidationRules = rules => {
  validatorFormRules = rules;
};

/**
 * It consists of generic validation rules for form feilds.
 * If the definition keys if missing, needs to be added here.
 * These keys are referenced using setValidationRules
 */
const ruleDefinition = {
  notEmpty: {
    regEx: /^.{1,}$/,
    errMsg: 'cannot be empty'
  },
  weightUnits: {
    regEx: /^(gms|pcs?|kg|kgs)$/,
    errMsg: 'Not valid unit'
  },
  minLength2: {
    regEx: /^.{2,}$/,
    errMsg: 'must be longer than two characters'
  },
  password: {
    regEx: /^.{4,}$/,
    errMsg: 'should be greater than 3 characters'
  },
  pincode: {
    regEx: /^.{6}$/,
    errMsg: 'should be of 6 characters'
  },
  onlyWords: {
    regEx: /^[a-zA-Z ]*$/,
    errMsg: 'must be alphabets only'
  },
  onlyNumbers: {
    regEx: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    errMsg: 'must be numbers only'
  },
  minLength10: {
    regEx: /^.{10,}$/,
    errMsg: 'length must be 10'
  },
  bankAccountNo: {
    regEx: /^\d{9,18}$/,
    errMsg: 'Please enter a valid bank account number'
  },
  ifscCode: {
    regEx: /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/,
    errMsg: 'Please enter a valid IFSC code'
  }
};

/**
 * It iterates over each rule
 * and if value is invalid it returns coresponding error message
 */
const getValidationErrors = (key, value) => {
  let errorMessage = {};
  let rules;
  if (validatorFormRules[key]) {
    rules = validatorFormRules[key];
    rules.forEach(ruleName => {
      let rule = ruleDefinition[ruleName];
      if (!rule.regEx.test(value)) {
        if (errorMessage[key] == null) {
          errorMessage[key] = {};
        }
        if (errorMessage[key]['message'] == null) {
          errorMessage[key]['message'] = '';
        }
        errorMessage[key]['message'] += `${rule.errMsg + '. '}`;
        errorMessage[key]['isValid'] = false;
      }
    });
  }
  return errorMessage;
};

const hasValidationRules = key => {
  return validatorFormRules != null && validatorFormRules[key] != null;
};

/**
 * It checks for validation error and updates error state for
 * components corresponding input feild
 */
export const validate = (component, key, value, errObj) => {
  let errorFlag = false;
  if (hasValidationRules(key)) {
    const error = getValidationErrors(key, value);
    if (error[key] != null) {
      errorFlag = true;
    }
    errors[key] = error[key];
    component.setState({
      [errObj]: errors
    });
  }
  return !errorFlag;
};
