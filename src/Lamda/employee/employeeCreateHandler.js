const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "employee",
  password: "postgres",
  port: 5432,
});

const getEmployee = async (event) => {
  console.log("inside the get employee method");
  const employeeId = event.queryStringParameters.employeeId;
  //const tableName = 'employees'; // Replace 'employees' with your actual table name

  try {
    console.log("inside the try block of get employee method");
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM employees");
    console.log("query exicuted and the result", result);
    client.release();
    console.log("checking the length of result");
    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Employee not found' }),
      };
    }
    console.log("return result");
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (error) {
    console.error('Error executing query', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

module.exports = {
  getEmployee,
};
