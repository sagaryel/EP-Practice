const httpStatusCodes = {
    BAD_REQUEST: '400',
    INTERNAL_SERVER_ERROR: '500',
    SUCCESS: '200',
    CREATED: '201',
    UNAUTHORIZED: '12008'
};

const httpStatusMessages = {
    SUCCESSFULLY_CREATED_EMPLOYEE_DETAILS :'Successfully created employee details.',
    FAILED_TO_CREATE_EMPLOYEE_DETAILS  : 'Failed to create employee details.',
    FAILED_TO_UPDATE_ASSSET_DETAILS : 'Failed to update assset details.',
    SUCCESSFULLY_UPDATED_ASSSET_DETAILS : 'Successfully updated assset details.',
    SUCCESSFULLY_RETRIEVED_BANK_DETAILS_FOR_EMPLOYEE : 'Successfully retrived bank details for employee',
    FAILED_TO_RETRIEVE_BANK_DETAILS_FOR_EMPLOYEE : 'Failed to retrived bank details for employee',
    BANK_DETAILS_NOT_FOUND_FOR_EMPLOYEE : ' bank details not found for employee'
    
    
}

module.exports = {
    httpStatusCodes,
    httpStatusMessages
};