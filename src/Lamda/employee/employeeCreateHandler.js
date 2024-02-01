const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const createEmployee = async (event) => {
    const requestBody = JSON.parse(event.body);

    // Validate the input data (Add your validation logic)

    const params = {
        TableName: 'employee-Details', 
        Item: {
            employeeId: requestBody.employeeId,
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            dob: requestBody.dob,
            email: requestBody.email,
            branchOffice: requestBody.branchOffice
        }
    };

    try {
        await dynamoDB.put(params).promise();

        // Return all parameters in the response
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Employee created successfully',
                employee: params.Item // Return all params of the created employee
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                message: 'Failed to certificate details.',
                errorMsg: error.message,
                errorStack: error.stack,
            })
        };
    }
};