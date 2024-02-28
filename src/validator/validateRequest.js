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
        throw new Error('Invalid account number, please add a 12 digit account number');
    } else if (routingNumber && !isValidRoutingNumber(routingNumber)) {
        throw new Error('Invalid routing number, please add a 9 digit routing number');
    }
    // You can add more specific validation logic for each field if needed
    return true;
};

function isValidAccountNumber(accountNumber) {
    // Regular expression to match exactly 11 digits
    const regex = /^[0-9]{12}$/;

    // Test if the provided account number matches the pattern
    return regex.test(accountNumber);
}
function isValidRoutingNumber(routingNumber) {
    // Regular expression to match exactly 9 digits
    const regex = /^\d{9}$/;

    // Test if the provided routing number matches the pattern
    return regex.test(routingNumber);
}




module.exports = {
    validateEmployeeDetails,
    validateBankUpdateDetails
};