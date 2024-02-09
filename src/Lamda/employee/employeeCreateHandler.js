const {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  GetItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const moment = require("moment");
const client = new DynamoDBClient();
const {
  httpStatusCodes,
  httpStatusMessages,
} = require("../../environment/appconfig");
const { validateEmployeeDetails } = require("../../validator/validateRequest");
const currentDate = Date.now(); // get the current date and time in milliseconds
//const formattedDate = moment(currentDate).format("YYYY-MM-DD HH:mm:ss"); //formating date
const createdDate = new Date().toISOString();

const createEmployee = async (event) => {
  console.log("inside the create employee details");
  const response = { statusCode: httpStatusCodes.SUCCESS };
  try {
    const requestBody = JSON.parse(event.body);
    
    // Check for required fields
    // const requiredFields = ['employeeId', 'firstName', 'lastName', 'dateOfBirth', 'officeEmailAddress', 'branchOffice'];
    // if (!requiredFields.every(field => requestBody[field])) {
    //     throw new Error('Required fields are missing.');
    // }
    if (!validateEmployeeDetails(requestBody)) {
      throw new Error("Required fields are missing.");
    }

    // Check if the employeeId already exists
    const employeeIdExists = await isEmployeeIdExists(requestBody.employeeId);
    if (employeeIdExists) {
      throw new Error("EmployeeId already exists.");
    }

    // Check if the email address already exists
    const emailExists = await isEmailExists(requestBody.officeEmailAddress);
    if (emailExists) {
      throw new Error("Email address already exists.");
    }

    // Fetch the highest highestSerialNumber from the DynamoDB table
    const highestSerialNumber = await getHighestSerialNumber();
    const nextSerialNumber = highestSerialNumber !== undefined ? highestSerialNumber + 1 : 1;



    const params = {
      TableName: process.env.EMPLOYEE_TABLE,
      Item: marshall({
        serialNumber: nextSerialNumber,
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
        createdDateTime: createdDate,
        updatedDateTime: requestBody.updatedDateTime || null,
        department: requestBody.department || null,
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

// Function to check if employeeId already exists
const isEmployeeIdExists = async (employeeId) => {
  const params = {
    TableName: process.env.EMPLOYEE_TABLE,
    Key: { employeeId: { S: employeeId } },
  };
  const { Item } = await client.send(new GetItemCommand(params));
  // If Item is not null, employeeId exists
  return !!Item;
};

const isEmailExists = async (emailAddress) => {
  const params = {
    TableName: process.env.EMPLOYEE_TABLE,
    FilterExpression: "officeEmailAddress = :email",
    ExpressionAttributeValues: {
      ":email": { S: emailAddress },
    },
    ProjectionExpression: "officeEmailAddress",
  };

  const command = new ScanCommand(params);
  const data = await client.send(command);
  return data.Items.length > 0;
};

const getHighestSerialNumber = async () => {
  const params = {
    TableName: process.env.EMPLOYEE_TABLE,
    ProjectionExpression: "serialNumber",
    Limit: 1,
    ScanIndexForward: false, // Sort in descending order
    KeyConditionExpression: "serialNumber > :num",
    ExpressionAttributeValues: {
      ":num": 0 // Assuming serialNumber starts from 1, adjust if different
    }
  };

  try {
    const data = await dynamodb.query(params).promise();
    if (data.Count > 0) {
      return data.Items[0].serialNumber.N; // Assuming serialNumber is a Number attribute
    }
    return undefined; // Return undefined if no records found
  } catch (error) {
    console.error("Error fetching highest serial number:", error);
    throw error;
  }
};

module.exports = {
  createEmployee,
};
