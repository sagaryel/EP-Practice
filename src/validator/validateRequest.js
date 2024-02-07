// validator.js
const validateEmployeeDetails = (requestBody) => {
    const { employeeId, firstName, lastName, dateOfBirth, officeEmailAddress, branchOffice } = requestBody;

    // Check if required fields are missing
    if (!employeeId || !firstName || !lastName || !dateOfBirth || !officeEmailAddress || !branchOffice) {
        return false;
    } else if (!officeEmailAddress.endsWith('.hyniva.com')) {
        throw new Error('Invalid officeEmailAddress domain. It should end with ".hyniva.com".');
    }
    // You can add more specific validation logic for each field if needed
    return true;
};

const isValidOfficeEmailAddress = (emailAddress) => {
    return emailAddress.endsWith('.hyniva.com');
};

module.exports = {
    validateEmployeeDetails,
    isValidOfficeEmailAddress
};