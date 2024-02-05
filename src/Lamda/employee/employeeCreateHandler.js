const {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const moment = require('moment');
const client = new DynamoDBClient();
const { httpStatusCodes, responseMessages } = require('../environment/appconfig');
const currentDate = Date.now();      // get the current date and time in milliseconds
const formattedDate = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');    //formating date

const createEmployee = async (event) => {
  console.log("inside the create employee details");
  const response = { statusCode: httpStatusCodes.SUCCESS};
  try {
    const requestBody = JSON.parse(event.body);

    // Check for required fields
    const requiredFields = ['empId', 'firstName', 'lastName', 'dob', 'email', 'branchOffice'];
    if (!requiredFields.every(field => requestBody[field])) {
      throw new Error('Required fields are missing.');
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Item: marshall({
        empId: requestBody.empId,
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        dob: requestBody.dob,
        email: requestBody.email,
        branchOffice: requestBody.branchOffice,
        password: requestBody.password,
        gender: requestBody.gender || null,
        ssnNumber: requestBody.ssnNumber || null,
        maritalStatus: requestBody.maritalStatus || null,
        nationality: requestBody.nationality || null,
        passportNumber: requestBody.passportNumber || null,
        mobileNumber: requestBody.mobileNumber || null,
        PermanentAddress: requestBody.PermanentAddress || null,
        relation: requestBody.relation || null,
        personalEmailAddress: requestBody.personalEmailAddress || null,
        PresentAddress: requestBody.PresentAddress || null,
        contactNumber: requestBody.contactNumber || null,
        officeEmailAddress: requestBody.officeEmailAddress || null,
        joiningDate: requestBody.joiningDate || null,
        emergencyContactPerson: requestBody.emergencyContactPerson || null,
        designation: requestBody.designation || null,
        emergencyContactNumber: requestBody.emergencyContactNumber || null,
        resignedDate: requestBody.resignedDate || null,
        relievedDate: requestBody.relievedDate || null,
        leaveStructure: requestBody.leaveStructure || null,
        createdDateTime: formattedDate,
        updatedDateTime: requestBody.updatedDateTime || null,
        department: requestBody.department || null
      }),
    };
    const createResult = await client.send(new PutItemCommand(params));
    response.body = JSON.stringify({
      message: responseMessages.SUCCESSFULLY_CREATED_EMPLOYEE_DETAILS,
      createResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.body = JSON.stringify({
      message: responseMessages.FAILED_TO_CREATE_EMPLOYEE_DETAILS,
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

module.exports = {
  createEmployee
};
