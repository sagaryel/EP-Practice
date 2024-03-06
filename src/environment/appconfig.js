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
    BANK_DETAILS_NOT_FOUND_FOR_EMPLOYEE : ' bank details not found for employee',
    FAILED_TO_UPDATE_BANK_DETAILS : 'failed to update bank details',
    SUCCESSFULLY_UPDATED_BANK_DETAILS : 'successfully updated bank details',
    SUCCESSFULLY_UPDATED_OR_CREATED_PF_DETAILS : 'successfully updated or created pf details',
    FAILED_TO_UPDATED_OR_CREATE_PF_DETAILS : 'failed to update or create pf details'
}

module.exports = {
    httpStatusCodes,
    httpStatusMessages
};