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
    SUCCESSFULLY_UPDATED_PF_DETAILS : 'successfully updated PF ESI details',
    SUCCESSFULLY_CREATED_PF_DETAILS : 'successfully created PF ESI details',
    FAILED_TO_CREATE_OR_UPDATE_PF_DETAILS : 'failed to create or update PF ESI details',
    PF_ESI_NOT_FOUND_FOR_EMPLOYEE : 'PF ESI Details not found for employee',
    SUCCESSFULLY_RETRIEVED_PF_ESI_DETAILS_FOR_EMPLOYEE : 'Successfully retrived PF ESI details for employee',
    FAILED_TO_RETRIEVE_PF_ESI_DETAILS_FOR_EMPLOYEE : 'Failed to retrived PF ESI details for employee',
    ALREADY_PF_DETAILS_CREATED_FOR_EMPLOYEE : 'already pf details creted for employee',
    FAILED_TO_RETRIEVE_EMPLOYEES :'failed to retrive the employees',
    NO_EMPLOYEES_FOUND : 'no employees found',
    SUCCESSFULLY_RETRIEVED_ASSET_INFORMATION : 'Successfully retrived asset information',
    FAILED_TO_RETRIEVE_ASSET_INFORMATION : 'Failed to retrive asset information',
    ASSET_INFORMATION_NOT_FOUND : 'asset information not found'
}



module.exports = {
    httpStatusCodes,
    httpStatusMessages
};