// validator.js
const validateEmployeeDetails = (requestBody) => {
    const { employeeId, firstName, lastName, dateOfBirth, officeEmailAddress, branchOffice } = requestBody;

    // Check if required fields are missing
    if (!employeeId || !firstName || !lastName || !dateOfBirth || !officeEmailAddress) {
        return false;
    } else if (!officeEmailAddress.endsWith('@hyniva.com')) {
        throw new Error('Invalid officeEmailAddress domain. It should end with ".hyniva.com".');
    }
    // You can add more specific validation logic for each field if needed
    return true;
};


const validateBankUpdateDetails = (requestBody) => {
    const { bankName, bankAddress, accountHolderName, accountNumber, accountType, routingNumber } = requestBody;
  
    // Check if required fields are missing
    if (!bankName || !bankAddress || !accountHolderName || !accountNumber || !accountType) {
        return false;
    } else if (!isValidAccountNumber(accountNumber)) {
        throw new Error('Invalid account number, please add a 5 to 16 digit account number');
    } else if (routingNumber && !isValidRoutingNumber(routingNumber)) {
        throw new Error('Invalid routing number, please add a 9 digit routing number');
    }else if (requestBody.ifscCode && !isValidatedIfsc(requestBody.ifscCode)) {
      throw new Error('Invalid ifsc, please add a 11 digit ifsc number');
    }else if (!isValidAccountType(accountType)) {
        throw new Error('Invalid account type, please choose Savings or Salary');
    }
    return true;
  };

  function isValidAccountNumber(accountNumber) {
    // Regular expression to match between 5 to 16 digits
    const regex = /^[0-9]{5,16}$/;
  
    // Test if the provided account number matches the pattern
    return regex.test(accountNumber);
  }
function isValidRoutingNumber(routingNumber) {
    // Regular expression to match exactly 9 digits
    const regex = /^\d{9}$/;

    // Test if the provided routing number matches the pattern
    return regex.test(routingNumber);
}
function isValidAccountType(accountType) {
    return accountType === 'Savings' || accountType === 'Salary';
}
function isValidatedIfsc(ifscCode) {
    const regex = /^[a-zA-Z0-9]{11}$/;
    return regex.test(ifscCode);
}

const validatePfDetails = (requestBody) => {
    const { uanNumber, pfNumber, pfJoiningDate, esiNumber, esiJoiningDate, esiLeavingDate } = requestBody;
  
    // Check if required fields are missing
    if (!uanNumber || !pfNumber || !pfJoiningDate || !esiNumber || !esiJoiningDate || !esiLeavingDate) {
        return false;
    } else if (!isValidUANNumber(uanNumber)) {
        throw new Error('Invalid UAN number, please add a 12 digit UAN number');
    } else if (!isValidPFNumber(pfNumber)) {
        throw new Error('Invalid PF Number, please add a 22 digit PF Number');
    }else if (!isValidESINumber(esiNumber)) {
      throw new Error('Invalid ESI Number, please add a 13 digit ESI Number');
    }
    return true;
  };

const isValidUANNumber = (uanNumber) => {
    return /^\d{12}$/.test(uanNumber);
};
const isValidPFNumber = (pfNumber) => {
    return /^[a-zA-Z0-9]{22}$/.test(pfNumber);
};
const isValidESINumber = (esiNumber) => {
    return /^\d{13}$/.test(esiNumber);
};


module.exports = {
    validateEmployeeDetails,
    validateBankUpdateDetails,
    validatePfDetails
};