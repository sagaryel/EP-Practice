const httpStatusCodes = {
    BAD_REQUEST: '400',
    INTERNAL_SERVER_ERROR: '500',
    SUCCESS: '200',
    CREATED: '201',
    UNAUTHORIZED: '12008'
};

const httpStatusMessages = {
    SUCCESSFULLY_CREATED_EMPLOYEE_DETAILS :'Successfully created employee details.',
    FAILED_TO_CREATE_EMPLOYEE_DETAILS  : 'Failed to create employee details.'
}

module.exports = {
    httpStatusCodes,
    httpStatusMessages
};