const {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  GetItemCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
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
    console.log("Highest Serial Number:", highestSerialNumber);
    const nextSerialNumber = highestSerialNumber !== null ? parseInt(highestSerialNumber) + 1 : 1;



    const params = {
      TableName: process.env.EMPLOYEE_TABLE,
      Item: marshall({
        serialNumber:nextSerialNumber,
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

async function getHighestSerialNumber() {
  const params = {
    TableName: process.env.EMPLOYEE_TABLE,
    ProjectionExpression: "serialNumber",
    Limit: 100, // Increase the limit to retrieve more items for sorting
  };

  try {
    const result = await client.send(new ScanCommand(params));
   
    // Sort the items in descending order based on assignmentId
    const sortedItems = result.Items.sort((a, b) => {
      return parseInt(b.serialNumber.N) - parseInt(a.serialNumber.N);
    });

    console.log("Sorted Items:", sortedItems); // Log the sorted items

    if (sortedItems.length === 0) {
      return 0; // If no records found, return null
    } else {
      const highestSerialNumber = parseInt(sortedItems[0].serialNumber.N);
      console.log("Highest Assignment ID:", highestSerialNumber);
      return highestSerialNumber;
    }
  } catch (error) {
    console.error("Error retrieving highest serial number:", error);
    throw error; // Propagate the error up the call stack
  }
}

const getAssignmentsByEmployeeId = async (event) => {
  console.log("Fetching assignments details by employee ID");
  const employeeId = event.pathParameters.employeeId;

  const response = { statusCode: httpStatusCodes.SUCCESS };
  try {
    const params = {
      TableName: process.env.ASSIGNMENTS_TABLE,
      FilterExpression: 'employeeId = :employeeId',
      ExpressionAttributeValues: {
        ':employeeId': { S: employeeId } // Assuming employeeId is a string, adjust accordingly if not
      }
    };
    const command = new ScanCommand(params);
    const { Items } = await client.send(command);

    if (!Items || Items.length === 0) {
      console.log("Assignments for employee not found.");
      response.statusCode = httpStatusCodes.NOT_FOUND;
      response.body = JSON.stringify({
        message: httpStatusMessages.ASSIGNMENTS_NOT_FOUND_FOR_EMPLOYEE,
      });
    } else {
      console.log("Successfully retrieved assignments for employee.");
      response.body = JSON.stringify({
        message: httpStatusMessages.SUCCESSFULLY_RETRIEVED_ASSIGNMENTS_FOR_EMPLOYEE,
        data: Items.map(item => unmarshall(item)) // Unmarshalling each item
      });
    }
  } catch (error) {
    console.error(error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.body = JSON.stringify({
      message: httpStatusMessages.FAILED_TO_RETRIEVE_ASSIGNMENTS,
      error: error.message
    });
  }
  return response;
};

module.exports = {
  createEmployee,
  getAssignmentsByEmployeeId
};
