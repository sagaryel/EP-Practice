const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const getEmployee = async (event) => {
  const employeeId = event.queryStringParameters.employeeId;
  const tableName = 'employees'; // Replace 'employees' with your actual table name

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM ' + tableName + ' WHERE employee_id = $1', [employeeId]);
    client.release();

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Employee not found' }),
      };
    }

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
