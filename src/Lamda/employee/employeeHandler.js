const { Pool } = require('pg');

// Initialize the Pool using environment variables
const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const getEmployee = async (event) => {
  console.log("inside the get employee method");
  const employeeId = event.queryStringParameters.employeeId;

  try {
    console.log("inside the try block of get employee method");
    const client = await pool.connect();

    // Use parameterized query to prevent SQL injection
    const result = await client.query("SELECT * FROM employee_details WHERE id = $1", [employeeId]);
    console.log("query executed and the result:", result);

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


const createEmployee = async (event) => {
  console.log("inside the create employee method");
  const {id, firstName, lastName } = JSON.parse(event.body);

  try {
    console.log("inside the try block of create employee method");
    const client = await pool.connect();

    // Use parameterized query to prevent SQL injection
    const result = await client.query(
      "INSERT INTO employee_details (id, firstName, lastname) VALUES ($1, $2, $3) RETURNING *",
      [id, firstName, lastName]
    );
    console.log("query executed and the result:", result);

    client.release();

    return {
      statusCode: 201,
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
  createEmployee,
};