// validator.js
const validateEmployeeDetails = (requestBody) => {
  const {
    employeeId,
    firstName,
    lastName,
    dateOfBirth,
    officeEmailAddress,
    branchOffice,
  } = requestBody;

  // Check if required fields are missing
  if (
    !employeeId ||
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !officeEmailAddress
  ) {
    return false;
  } else if (!officeEmailAddress.endsWith("@hyniva.com")) {
    throw new Error(
      'Invalid officeEmailAddress domain. It should end with ".hyniva.com".'
    );
  }
  // You can add more specific validation logic for each field if needed
  return true;
};

const validateBankUpdateDetails = (requestBody) => {
  const {
    bankName,
    bankAddress,
    accountHolderName,
    accountNumber,
    accountType,
    routingNumber,
  } = requestBody;

  // Check if required fields are missing
  if (
    !bankName ||
    !bankAddress ||
    !accountHolderName ||
    !accountNumber ||
    !accountType
  ) {
    return false;
  } else if (!isValidAccountNumber(accountNumber)) {
    throw new Error(
      "Invalid account number, please add a 5 to 16 digit account number"
    );
  } else if (routingNumber && !isValidRoutingNumber(routingNumber)) {
    throw new Error(
      "Invalid routing number, please add a 9 digit routing number"
    );
  } else if (requestBody.ifscCode && !isValidatedIfsc(requestBody.ifscCode)) {
    throw new Error("Invalid ifsc, please add a 11 digit ifsc number");
  } else if (!isValidAccountType(accountType)) {
    throw new Error("Invalid account type, please choose Savings or Salary");
  }
  return true;
};

function isValidAccountNumber(accountNumber) {
  // Regular expression to match between 5 to 16 digits
  const regex = /^[0-9]{5,16}$/;

  // Test if the provided account number matches the pattern
  return regex.test(accountNumber);
}
function isValidRoutingNumber(routingNumber) {
  // Regular expression to match exactly 9 digits
  const regex = /^\d{9}$/;

  // Test if the provided routing number matches the pattern
  return regex.test(routingNumber);
}
function isValidAccountType(accountType) {
  return accountType === "Savings" || accountType === "Salary";
}
function isValidatedIfsc(ifscCode) {
  const regex = /^[a-zA-Z0-9]{11}$/;
  return regex.test(ifscCode);
}

const validatePfDetails = (requestBody) => {
  const {
    uanNumber,
    pfNumber,
    pfJoiningDate,
    esiNumber,
    esiJoiningDate,
    esiLeavingDate,
  } = requestBody;

  // Check if required fields are missing
  if (
    !uanNumber ||
    !pfNumber ||
    !pfJoiningDate ||
    !esiNumber ||
    !esiJoiningDate ||
    !esiLeavingDate
  ) {
    return false;
  } else if (!isValidUANNumber(uanNumber)) {
    throw new Error("Invalid UAN number, please add a 12 digit UAN number");
  } else if (!isValidPFNumber(pfNumber)) {
    throw new Error("Invalid PF Number, please add a 22 digit PF Number");
  } else if (!isValidESINumber(esiNumber)) {
    throw new Error("Invalid ESI Number, please add a 13 digit ESI Number");
  } else if (!isValidDateFormat(pfJoiningDate)) {
    throw new Error(
      "pfJoiningDate is not in a valid date format, please add a MM/DD/YYYY"
    );
  } else if (!isValidDateFormat(esiJoiningDate)) {
    throw new Error(
      "esiJoiningDate is not in a valid date format, please add a MM/DD/YYYY"
    );
  } else if (!isValidDateFormat(esiLeavingDate)) {
    throw new Error(
      "esiLeavingDate is not in a valid date format, please add a MM/DD/YYYY"
    );
  }
  return true;
};

const isValidUANNumber = (uanNumber) => {
  return /^\d{12}$/.test(uanNumber);
};
const isValidPFNumber = (pfNumber) => {
  return /^[a-zA-Z0-9]{22}$/.test(pfNumber);
};
const isValidESINumber = (esiNumber) => {
  return /^\d{13}$/.test(esiNumber);
};

function isValidDateFormat(dateString) {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
  return regex.test(dateString);;
}

const validateCreateDocument = (requestBody) => {
  const {
    documentType,
    documentName,
    updateDate,
    employeeId,
   } = requestBody;

  // Check if required fields are missing
  if (!documentType || !documentName || !employeeId || !updateDate) {
    return false;
  }

  // Check if updateDate is in MM/DD/YYYY format and is today's date
  const today = new Date();
  const updateDateObj = new Date(updateDate);
  const isToday = updateDateObj.toDateString() === today.toDateString();
  if (!isValidDateFormat(updateDate) || !isToday) {
    throw new Error("updateDate must be today's date in MM/DD/YYYY format.");
  }

  return true;
};

const autoIncreamentId = async (table, id) => {
  const params = {
    TableName: table,
    ProjectionExpression: id,
    Limit: 1000,
    ScanIndexForward: false,
  };

  try {
    const result = await client.send(new ScanCommand(params));
    console.log("Method autoIncreamentId DynamoDB Result ", id, " : ", result.Items.length);
    if (!result.Items || result.Items.length === 0) {
      return 1;
    } else {
      let incrementIdObj;
      let increamentId;
      if ("employeeId" === id) {
        console.log("Create employeeId");
        const sortedItems = result.Items.filter((item) => item.employeeId && !isNaN(item.employeeId.N));
        if (sortedItems.length > 0) {
          sortedItems.sort((a, b) => parseInt(b.employeeId.N) - parseInt(a.employeeId.N));
          incrementIdObj = sortedItems[0];
          increamentId = parseInt(incrementIdObj.employeeId.N);
        } else {
          increamentId = 0;
        }
      } else if ("assignmentId" === id) {
        console.log("Create assignmentId");
        const sortedItems = result.Items.filter((item) => item.assignmentId && !isNaN(item.assignmentId.N));
        if (sortedItems.length > 0) {
          sortedItems.sort((a, b) => parseInt(b.assignmentId.N) - parseInt(a.assignmentId.N));
          incrementIdObj = sortedItems[0];
          increamentId = parseInt(incrementIdObj.assignmentId.N);
        } else {
          increamentId = 0;
        }
      }else if("documentId" === id ){
        console.log("Create documentId");
        const sortedItems = result.Items.filter((item) => item.documentId && !isNaN(item.documentId.N));
        if (sortedItems.length > 0) {
          sortedItems.sort((a, b) => parseInt(b.documentId.N) - parseInt(a.documentId.N));
          incrementIdObj = sortedItems[0];
          increamentId = parseInt(incrementIdObj.documentId.N);
        } else {
          increamentId = 0;
        }
      }
      const nextSerialNumber = increamentId !== null ? parseInt(increamentId) + 1 : 1;
      console.log("New Increament Id", nextSerialNumber);
      return nextSerialNumber;
    }
  } catch (error) {
    console.error("Error create new Increament id:", error);
    throw error;
  }
};


module.exports = {
  validateEmployeeDetails,
  validateBankUpdateDetails,
  validatePfDetails,
  validateCreateDocument,
  autoIncreamentId
};
