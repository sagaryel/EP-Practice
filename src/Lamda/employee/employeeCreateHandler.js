const {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient();

const createEmployee = async (event) => {
  console.log("inside the create employee details");
  const response = { statusCode: 200 };
  try {
    const requestBody = JSON.parse(event.body);

    // Check for required fields
    if (!requestBody.empId || !requestBody.firstName || !requestBody.lastName || !requestBody.dob || !requestBody.email || !requestBody.branchOffice) {
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
        gender: requestBody.gender,
        ssnNumber: requestBody.ssnNumber,
        maritalStatus: requestBody.maritalStatus,
        nationality: requestBody.nationality,
        passportNumber: requestBody.passportNumber,
        mobileNumber: requestBody.mobileNumber,
        PermanentAddress: requestBody.PermanentAddress,
        relation: requestBody.relation,
        personalEmailAddress: requestBody.personalEmailAddress,
        PresentAddress: requestBody.PresentAddress,
        contactNumber: requestBody.contactNumber,
        officeEmailAddress: requestBody.officeEmailAddress,
        joiningDate: requestBody.joiningDate,
        emergencyContactPerson: requestBody.emergencyContactPerson,
        designation: requestBody.designation,
        emergencyContactNumber: requestBody.emergencyContactNumber,
        resignedDate: requestBody.resignedDate,
        relievedDate: requestBody.relievedDate,
        leaveStructure: requestBody.leaveStructure,
        createdDateTime: requestBody.createdDateTime,
        updatedDateTime: requestBody.updatedDateTime,
        department: requestBody.department
      }),
    };
    const createResult = await client.send(new PutItemCommand(params));
    response.body = JSON.stringify({
      message: 'Successfully created employee details.',
      createResult,
    });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: 'Failed to create employee details.',
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

module.exports = {
  createEmployee
};
