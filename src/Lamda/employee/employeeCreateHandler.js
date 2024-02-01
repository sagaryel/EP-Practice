const {
    DynamoDBClient,
    PutItemCommand,
    UpdateItemCommand,
  } = require('@aws-sdk/client-dynamodb');
  const { marshall } = require('@aws-sdk/util-dynamodb');
  
const client = new DynamoDBClient();

const createEmployee = async (event) =>  async (event) => {
    console.log("inside the create employee details");
    const response = { statusCode: 200 };
    try {
      const requestBody = JSON.parse(event.body);
      
      // Check for required fields
      if (!requestBody.empId.empId || !requestBody.firstName || !requestBody.lastName || !requestBody.dob || !requestBody.email || !requestBody.branchOffice) {
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
            branchOffice: requestBody.branchOffice
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
    