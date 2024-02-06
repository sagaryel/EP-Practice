// validator.js
const validateEmployeeDetails = (requestBody) => {
    const { employeeId, firstName, lastName, dateOfBirth, officeEmailAddress, branchOffice } = requestBody;

    // Check if required fields are missing
    if (!employeeId || !firstName || !lastName || !dateOfBirth || !officeEmailAddress || !branchOffice) {
        return false;
    }
    // You can add more specific validation logic for each field if needed
    return true;
};

module.exports = {
    validateEmployeeDetails
};