const {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const moment = require('moment');
const client = new DynamoDBClient();
const {httpStatusCodes, httpStatusMessages} = require("../../environment/appconfig");
const currentDate = Date.now();      // get the current date and time in milliseconds
const formattedDate = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');    //formating date


const createEmployee = async (event) => {
  console.log("inside the create employee details");
  const response = { statusCode: httpStatusCodes.SUCCESS };
  try {
      const requestBody = JSON.parse(event.body);

      // Check for required fields
      const requiredFields = ['employeeId', 'firstName', 'lastName', 'dateOfBirth', 'officeEmailAddress', 'branchOffice'];
      if (!requiredFields.every(field => requestBody[field])) {
          throw new Error('Required fields are missing.');
      }

      const params = {
          TableName: process.env.EMPLOYEE_TABLE,
          Item: marshall({
              employeeId: requestBody.employeeId,
              firstName: requestBody.firstName,
              lastName: requestBody.lastName,
              dateOfBirth: requestBody.dateOfBirth,
              officeEmailAddress: requestBody.officeEmailAddress,
              branchOffice: requestBody.branchOffice,
              password: requestBody.password || null,
              gender: requestBody.gender || null,
              ssnNumber: requestBody.ssnNumber || null,
              maritalStatus: requestBody.maritalStatus || null,
              nationality: requestBody.nationality || null,
              passportNumber: requestBody.passportNumber || null,
              mobileNumber: requestBody.mobileNumber || null,
              permanentAddress: requestBody.permanentAddress || null,
              contactPerson: requestBody.contactPerson || null,
              personalEmailAddress: requestBody.personalEmailAddress || null,
              presentAddress: requestBody.presentAddress || null,
              contactNumber: requestBody.contactNumber || null,
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
          message: httpStatusMessages.SUCCESSFULLY_CREATED_EMPLOYEE_DETAILS,
          createResult,
      });
  } catch (e) {
      console.error(e);
      response.statusCode = httpStatusCodes.BAD_REQUEST;
      response.body = JSON.stringify({
          message: httpStatusMessages.FAILED_TO_CREATE_EMPLOYEE_DETAILS,
          errorMsg: e.message,
          errorStack: e.stack,
      });
  }
  return response;
};

module.exports = {
  createEmployee
};
