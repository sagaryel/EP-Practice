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
const {
  validateEmployeeDetails,
  validateBankUpdateDetails,
  validatePfDetails,
} = require("../../validator/validateRequest");
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
    const nextSerialNumber =
      highestSerialNumber !== null ? parseInt(highestSerialNumber) + 1 : 1;

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
      message: httpStatusMessages.SUCCESSFULLY_CREATED_ASSIGNMENT_DETAILS,
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

// async function getHighestSerialNumber() {
//   const params = {
//     TableName: process.env.EMPLOYEE_TABLE,
//     ProjectionExpression: "serialNumber",
//     Limit: 100, // Increase the limit to retrieve more items for sorting
//   };

//   try {
//     const result = await client.send(new ScanCommand(params));

//     // Sort the items in descending order based on assignmentId
//     const sortedItems = result.Items.sort((a, b) => {
//       return parseInt(b.serialNumber.N) - parseInt(a.serialNumber.N);
//     });

//     console.log("Sorted Items:", sortedItems); // Log the sorted items

//     if (sortedItems.length === 0) {
//       return 0; // If no records found, return null
//     } else {
//       const highestSerialNumber = parseInt(sortedItems[0].serialNumber.N);
//       console.log("Highest Assignment ID:", highestSerialNumber);
//       return highestSerialNumber;
//     }
//   } catch (error) {
//     console.error("Error retrieving highest serial number:", error);
//     throw error; // Propagate the error up the call stack
//   }
// }

async function getHighestSerialNumber() {
        const params = {
          TableName: process.env.PF_ESI_TABLE,
          ProjectionExpression: "pfId",
          Limit: 100, // Increase the limit to retrieve more items for sorting
        };
      
        try {
          const result = await client.send(new ScanCommand(params));
          
          // Sort the items in descending order based on assignmentId
          const sortedItems = result.Items.sort((a, b) => {
            return parseInt(b.pfId.N) - parseInt(a.pfId.N);
          });
      
          console.log("Sorted Items:", sortedItems); // Log the sorted items
      
          if (sortedItems.length === 0) {
            return 0; // If no records found, return null
          } else {
            const highestPfId = parseInt(sortedItems[0].pfId.N);
            console.log("Highest Assignment ID:", highestPfId);
            return highestPfId;
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
      FilterExpression: "employeeId = :employeeId",
      ExpressionAttributeValues: {
        ":employeeId": { S: employeeId }, // Assuming employeeId is a string, adjust accordingly if not
      },
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
        message:
          httpStatusMessages.SUCCESSFULLY_RETRIEVED_ASSIGNMENTS_FOR_EMPLOYEE,
        data: Items.map((item) => unmarshall(item)), // Unmarshalling each item
      });
    }
  } catch (error) {
    console.error(error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.body = JSON.stringify({
      message: httpStatusMessages.FAILED_TO_RETRIEVE_ASSIGNMENTS,
      error: error.message,
    });
  }
  return response;
};

const updateAssetDetails = async (event) => {
  console.log("inside the asset update  details");
  let response;
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const requestBody = JSON.parse(event.body);
    const assetId = event.pathParameters.assetId;

    // Get asset details from DynamoDB based on assetId
    const getParams = {
      TableName: process.env.ASSETS_TABLE,
      Key: {
        assetId: { N: assetId },
      },
    };

    const getCommand = new GetItemCommand(getParams);
    const assetResult = await client.send(getCommand);

    // If asset not found
    if (!assetResult.Item) {
      response = {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: "Asset not found for the specified assetId",
        }),
      };
      return response;
    }

    const assignedTOExist = await isAssignedToExists(requestBody.assignTo);
    if (assignedTOExist) {
      throw new Error(
        `The specified 'assignTo' ${requestBody.assignTo} is already assigned with an asset ID `
      );
    }

    // Update the asset with the new values
    const updateParams = {
      TableName: process.env.ASSETS_TABLE,
      Key: {
        assetId: { N: assetId },
      },
      UpdateExpression:
        "SET assetsType = :assetsType, serialNumber = :serialNumber, assignTo = :assignTo, #st = :status, updatedDateTime = :updatedDateTime",
      ExpressionAttributeValues: marshall({
        ":assetsType": requestBody.assetsType,
        ":serialNumber": requestBody.serialNumber,
        ":status": requestBody.status,
        ":assignTo": requestBody.assignTo || null,
        ":updatedDateTime": createdDate,
      }),
      ExpressionAttributeNames: {
        "#st": "status",
      },
      ReturnValues: "ALL_NEW",
    };

    const updateCommand = new UpdateItemCommand(updateParams);
    const updatedAsset = await client.send(updateCommand);
    console.log("Successfully updated asset.");

    response = {
      statusCode: httpStatusCodes.SUCCESS,
      headers,
      body: JSON.stringify({
        message: httpStatusMessages.SUCCESSFULLY_UPDATED_ASSSET_DETAILS,
        updatedAsset: unmarshall(updatedAsset.Attributes),
      }),
    };
  } catch (error) {
    console.error("Error updating asset details:", error);
    response = {
      statusCode: httpStatusCodes.BAD_REQUEST,
      headers,
      body: JSON.stringify({
        message: httpStatusMessages.FAILED_TO_UPDATE_ASSSET_DETAILS,
        errorMsg: error.message,
        errorStack: error.stack,
      }),
    };
  }

  return response;
};

// Check if the email address already exists
const isAssignedToExists = async (employeeId) => {
  const params = {
    TableName: process.env.ASSETS_TABLE,
    FilterExpression: "assignTo = :assign",
    ExpressionAttributeValues: {
      ":assign": { S: employeeId },
    },
    ProjectionExpression: "assignTo",
  };

  const command = new ScanCommand(params);
  const data = await client.send(command);
  return data.Items.length > 0;
};

const getBankDetailsByEmployeeId = async (event) => {
  console.log("Inside the get bank details by employee ID function");
  const employeeId = event.pathParameters.employeeId;

  const response = {
    statusCode: httpStatusCodes.SUCCESS,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  try {
    const params = {
      TableName: process.env.BANK_TABLE,
      FilterExpression: "employeeId = :employeeId",
      ExpressionAttributeValues: {
        ":employeeId": { S: employeeId }, // Assuming employeeId is a string, adjust accordingly if not
      },
    };
    const command = new ScanCommand(params);
    const { Items } = await client.send(command);

    if (!Items || Items.length === 0) {
      console.log("bank details not found for employee");
      response.statusCode = httpStatusCodes.NOT_FOUND;
      response.body = JSON.stringify({
        message: httpStatusMessages.BANK_DETAILS_NOT_FOUND_FOR_EMPLOYEE,
      });
    } else {
      console.log("Successfully retrived bank details for employee.");
      response.body = JSON.stringify({
        message:
          httpStatusMessages.SUCCESSFULLY_RETRIEVED_BANK_DETAILS_FOR_EMPLOYEE,
        data: Items.map((item) => unmarshall(item)), // Unmarshalling each item
      });
    }
  } catch (error) {
    console.error(error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.body = JSON.stringify({
      message: httpStatusMessages.FAILED_TO_RETRIEVE_BANK_DETAILS_FOR_EMPLOYEE,
      error: error.message,
    });
  }
  return response;
};

const updateBankDetails = async (event) => {
  console.log("Inside the bank details update function");
  let response;

  try {
    const requestBody = JSON.parse(event.body);
    const bankId = event.pathParameters.bankId;
    if (!validateBankUpdateDetails(requestBody)) {
      throw new Error("Required fields are missing.");
    }

    // Get asset details from DynamoDB based on assetId
    const getParams = {
      TableName: process.env.BANK_TABLE,
      Key: {
        bankId: { N: bankId },
      },
    };

    const getCommand = new GetItemCommand(getParams);
    const bankResult = await client.send(getCommand);

    // If asset not found
    if (!bankResult.Item) {
      response = {
        statusCode: 404,
        body: JSON.stringify({
          message: "Bank details not found for bank ID",
        }),
      };
      return response;
    }

    // Update the asset with the new values
    const updateParams = {
      TableName: process.env.BANK_TABLE,
      Key: {
        bankId: { N: bankId },
      },
      UpdateExpression:
        "SET bankName = :bankName, bankAddress = :bankAddress, ifscCode = :ifscCode, accountHolderName = :accountHolderName, accountNumber = :accountNumber, accountHolderResidentialAddress = :accountHolderResidentialAddress, #at = :accountType, routingNumber = :routingNumber, updatedDateTime = :updatedDateTime",
      ExpressionAttributeValues: marshall({
        ":bankName": requestBody.bankName,
        ":bankAddress": requestBody.bankAddress,
        ":ifscCode":
          requestBody.ifscCode !== null ? requestBody.ifscCode : null,
        ":accountHolderName": requestBody.accountHolderName,
        ":accountNumber": parseInt(requestBody.accountNumber),
        ":accountType": requestBody.accountType,
        ":updatedDateTime": createdDate,
        ":routingNumber":
          requestBody.routingNumber !== null ? requestBody.routingNumber : null,
        ":accountHolderResidentialAddress":
          requestBody.accountHolderResidentialAddress,
      }),
      ExpressionAttributeNames: {
        "#at": "accountType",
      },
      ReturnValues: "ALL_NEW",
    };

    const updateCommand = new UpdateItemCommand(updateParams);
    const updatedBank = await client.send(updateCommand);
    console.log("Successfully updated Bank details.");

    response = {
      statusCode: httpStatusCodes.SUCCESS,
      body: JSON.stringify({
        message: httpStatusMessages.SUCCESSFULLY_UPDATED_BANK_DETAILS, // Corrected typo
        updatedBank: unmarshall(updatedBank.Attributes),
      }),
    };
  } catch (error) {
    console.error("Error updating bank details:", error);
    response = {
      statusCode: httpStatusCodes.BAD_REQUEST,
      body: JSON.stringify({
        message: httpStatusMessages.FAILED_TO_UPDATE_BANK_DETAILS, // Corrected typo
        errorMsg: error.message,
        errorStack: error.stack,
      }),
    };
  }

  // Set headers outside try-catch to ensure they're always included
  response.headers = {
    "Access-Control-Allow-Origin": "*",
  };

  return response;
};

const updatePfDetails = async (event) => {
  console.log("Inside the PF details function");
  const response = {
    statusCode: httpStatusCodes.SUCCESS,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  try {
    const requestBody = JSON.parse(event.body);
    const employeeId = event.pathParameters.employeeId;
    // Fetch the highest highestSerialNumber from the DynamoDB table
    const highestSerialNumber = await getHighestSerialNumber();
    console.log("Highest Serial Number:", highestSerialNumber);
    const nextSerialNumber =
      highestSerialNumber !== null ? parseInt(highestSerialNumber) + 1 : 1;

    if (!validatePfDetails(requestBody)) {
      throw new Error("Required fields are missing.");
    }

    const params = {
      TableName: process.env.PF_ESI_TABLE,
      FilterExpression: "employeeId = :employeeId",
      ExpressionAttributeValues: {
        ":employeeId": { S: employeeId }, // Assuming employeeId is a string, adjust accordingly if not
      },
    };
    const command = new ScanCommand(params);
    const { Items } = await client.send(command);
    if (!Items || Items.length === 0) {
      console.log("Inside the PF details create function");
      const params = {
        TableName: process.env.PF_ESI_TABLE,
        Item: marshall({
          pfId: nextSerialNumber,
          employeeId: employeeId,
          uanNumber: requestBody.uanNumber,
          pfNumber: requestBody.pfNumber,
          pfJoiningDate: requestBody.pfJoiningDate,
          esiNumber: requestBody.esiNumber,
          esiJoiningDate: requestBody.esiJoiningDate,
          esiLeavingDate: requestBody.esiLeavingDate,
          createdDateTime: createdDate,
        }),
      };
      const createResult = await client.send(new PutItemCommand(params));
      response.body = JSON.stringify({
        message: httpStatusMessages.SUCCESSFULLY_CREATED_PF_DETAILS,
        createResult,
      });
    } else {
      console.log("Inside the PF details update function");
      const pfId = Items[0].pfId.N;
      const updateParams = {
        TableName: process.env.PF_ESI_TABLE,
        Key: {
          pfId: { N: pfId }, // You need to define pfId here
        },
        UpdateExpression: `
          SET uanNumber = :uanNumber,
              pfNumber = :pfNumber,
              pfJoiningDate = :pfJoiningDate,
              #esi = :esiNumber,
              esiJoiningDate = :esiJoiningDate,
              esiLeavingDate = :esiLeavingDate,
              updatedDateTime = :updatedDateTime
        `,
        ExpressionAttributeValues: marshall({
          ":uanNumber": requestBody.uanNumber,
          ":pfNumber": requestBody.pfNumber,
          ":pfJoiningDate": requestBody.pfJoiningDate,
          ":esiNumber": requestBody.esiNumber,
          ":esiJoiningDate": requestBody.esiJoiningDate,
          ":esiLeavingDate": requestBody.esiLeavingDate,
          ":updatedDateTime": createdDate,
        }),
        ExpressionAttributeNames: {
          "#esi": "esiNumber",
        },
        ReturnValues: "ALL_NEW",
      };

      const updateCommand = new UpdateItemCommand(updateParams);
      const updatedPfDetails = await client.send(updateCommand);
      console.log("Successfully updated PF/ESI details.");
      response.body = JSON.stringify({
        message: httpStatusMessages.SUCCESSFULLY_UPDATED_PF_DETAILS,
        updatedPfDetails: unmarshall(updatedPfDetails.Attributes),
      });
    }
  } catch (e) {
    console.error(e);
    response.statusCode = httpStatusCodes.BAD_REQUEST;
    response.body = JSON.stringify({
      message: httpStatusMessages.FAILED_TO_CREATE_OR_UPDATE_PF_DETAILS,
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

const createPfDetails = async (event) => {
  console.log("Inside the PF details function");
  const response = {
    statusCode: httpStatusCodes.SUCCESS,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  try {
    const requestBody = JSON.parse(event.body);
    const employeeId = requestBody.employeeId;
    console.log("employee Id :", employeeId);

    // Generate unique pfId
    const highestSerialNumber = await getHighestSerialNumber();
    console.log("Highest Serial Number:", highestSerialNumber);
    const nextSerialNumber = highestSerialNumber !== null ? parseInt(highestSerialNumber) + 1 : 1;

    if (!validatePfDetails(requestBody)) {
      throw new Error("Required fields are missing.");
    }

    // Check if the employee already has PF detail
    const params = {
      TableName: process.env.PF_ESI_TABLE,
      FilterExpression: "employeeId = :employeeId",
      ExpressionAttributeValues: {
        ":employeeId": { S: employeeId }, // Assuming employeeId is a string, adjust accordingly if not
      },
    };
    const command = new ScanCommand(params);
    const { Items } = await client.send(command);

    if (!Items || Items.length === 0) {
      console.log("Inside the PF details create function");
      const params = {
        TableName: process.env.PF_ESI_TABLE,
        Item: marshall({
          pfId: nextSerialNumber,
          employeeId: requestBody.employeeId,
          uanNumber: requestBody.uanNumber,
          pfNumber: requestBody.pfNumber,
          pfJoiningDate: requestBody.pfJoiningDate,
          esiNumber: requestBody.esiNumber,
          esiJoiningDate: requestBody.esiJoiningDate,
          esiLeavingDate: requestBody.esiLeavingDate,
          createdDateTime: createdDate,
        }),
      };

      const createResult = await client.send(new PutItemCommand(params));
      console.log("Create result:", createResult);

      response.body = JSON.stringify({
        message: httpStatusMessages.SUCCESSFULLY_CREATED_PF_DETAILS,
        data : unmarshall(params.Item),
      });
    } else {
      console.log("Inside the PF details update function");
      const pfId = Items[0].pfId.N;
      const updateParams = {
        TableName: process.env.PF_ESI_TABLE,
        Key: {
          pfId: { N: pfId }, // You need to define pfId here
        },
        UpdateExpression: `
        SET uanNumber = :uanNumber,
            pfNumber = :pfNumber,
            pfJoiningDate = :pfJoiningDate,
            #esi = :esiNumber,
            esiJoiningDate = :esiJoiningDate,
            esiLeavingDate = :esiLeavingDate,
            updatedDateTime = :updatedDateTime
      `,
        ExpressionAttributeValues: marshall({
          ":uanNumber": requestBody.uanNumber,
          ":pfNumber": requestBody.pfNumber,
          ":pfJoiningDate": requestBody.pfJoiningDate,
          ":esiNumber": requestBody.esiNumber,
          ":esiJoiningDate": requestBody.esiJoiningDate,
          ":esiLeavingDate": requestBody.esiLeavingDate,
          ":updatedDateTime": createdDate,
        }),
        ExpressionAttributeNames: {
          "#esi": "esiNumber",
        },
        ReturnValues: "ALL_NEW",
      };

      const updateCommand = new UpdateItemCommand(updateParams);
      const updatedPfDetails = await client.send(updateCommand);
      console.log("Successfully updated PF/ESI details.");
      response.body = JSON.stringify({
        message: httpStatusMessages.SUCCESSFULLY_UPDATED_PF_DETAILS,
        updatedPfDetails: unmarshall(updatedPfDetails.Attributes),
      });
    }
  } catch (e) {
    console.error(e);
    response.statusCode = httpStatusCodes.BAD_REQUEST;
    response.body = JSON.stringify({
      message: httpStatusMessages.FAILED_TO_CREATE_PF_DETAILS,
      errorMsg: e.message,
      errorStack: e.stack,
    });
  }
  return response;
};

const getPfEsiDetailsByEmployeeId = async (event) => {
  console.log("Inside the get PF ESI details by employee ID function");
  const employeeId = event.pathParameters.employeeId;

  const response = {
    statusCode: httpStatusCodes.SUCCESS,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  try {
    const params = {
      TableName: process.env.PF_ESI_TABLE,
      FilterExpression: "employeeId = :employeeId",
      ExpressionAttributeValues: {
        ":employeeId": { S: employeeId },
      },
    };
    const command = new ScanCommand(params);
    const { Items } = await client.send(command);

    if (!Items || Items.length === 0) {
      console.log("PF ESI details not found for employee");
      response.statusCode = httpStatusCodes.NOT_FOUND;
      response.body = JSON.stringify({
        message: httpStatusMessages.PF_ESI_NOT_FOUND_FOR_EMPLOYEE,
      });
    } else {
      console.log("Successfully retrived PF ESI details for employee.");
      response.body = JSON.stringify({
        message:
          httpStatusMessages.SUCCESSFULLY_RETRIEVED_PF_ESI_DETAILS_FOR_EMPLOYEE,
        data: Items.map((item) => unmarshall(item)),
      });
    }
  } catch (error) {
    console.error(error);
    response.statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
    response.body = JSON.stringify({
      message:
        httpStatusMessages.FAILED_TO_RETRIEVE_PF_ESI_DETAILS_FOR_EMPLOYEE,
      error: error.message,
    });
  }
  return response;
};


const getAllEmployees = async (event) => {
  console.log("Get all employees");
  const response = {
    statusCode: httpStatusCodes.SUCCESS,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  };
  const { pageNo = 1, pageSize = 10 } = event.queryStringParameters;
  try {
    const params = {
      TableName: process.env.EMPLOYEE_TABLE,
    };
    const { Items } = await client.send(new ScanCommand(params));
    Items.sort((a, b) => new Date(a.createdDateTime) - new Date(b.createdDateTime));
    console.log({ Items });
    if (!Items || Items.length === 0) {
      console.log("No employees found.");
      response.statusCode = httpStatusCodes.NOT_FOUND;
      response.body = JSON.stringify({
        message: httpStatusMessages.NO_EMPLOYEES_FOUND,
      });
    } else {
      console.log("Successfully retrieved all employees.");
      
      response.body = JSON.stringify({
        message: httpStatusMessages.SUCCESSFULLY_RETRIEVED_EMPLOYEES,
        data: paginate(Items.map(item => unmarshall(item)), pageNo, pageSize),
      });
    }
  } catch (e) {
    console.error(e);
    response.body = JSON.stringify({
      statusCode: e.statusCode,
      message: httpStatusMessages.FAILED_TO_RETRIEVE_EMPLOYEES,
      errorMsg: e.message,
    });
  }
  return response;
};

const paginate = (allItems, pageNo, pageSize) => {
  console.log("inside the pagination function");
  console.log("items length", allItems.length);
  // Calculate start and end indexes for pagination
  const startIndex = (pageNo - 1) * pageSize;
  console.log("start index", startIndex);
  const endIndex = pageNo * pageSize;
  console.log("endIndex index", endIndex);
  // Slice the array to get the current page of data
  const items = allItems.slice(startIndex, endIndex);
  console.log("items", items);
  // Return paginated data along with metadata
  return {
      items,
      totalItems: allItems.length,
      currentPage: pageNo,
      totalPages: Math.ceil(allItems.length / pageSize)
  };
};


module.exports = {
  createEmployee,
  getAssignmentsByEmployeeId,
  updateAssetDetails,
  getBankDetailsByEmployeeId,
  updateBankDetails,
  updatePfDetails,
  createPfDetails,
  getPfEsiDetailsByEmployeeId,
  getAllEmployees
};
