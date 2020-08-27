import sql from 'mssql'

let pool = null;

export async function closePool () 
{
    try 
    {
        // try to close the connection pool
        await pool.close();

        // set the pool to null to ensure
        // a new one will be created by getConnection()
        pool = null;
    } 
    catch ( err ) 
    {
        // error closing the connection (could already be closed)
        // set the pool to null to ensure
        // a new one will be created by getConnection()
        pool = null;
        console.log("closePool error");
        console.log(err);
    }

}

export async function getConnection (connectionString) 
{
    try 
    {
        if ( pool ) 
        {
            // has the connection pool already been created?
            // if so, return the existing pool
            return pool;
        }

        // create a new connection pool
        pool = await sql.connect(connectionString);

        // catch any connection errors and close the pool
        pool.on("error", async err => {
            console.log("connection pool error");
            console.log(err);
            await closePool();
        });

        return pool;

    } 
    catch ( err ) 
    {
        // error connecting to SQL Server
        console.log("error connecting to sql server");
        console.log(err);
        pool = null;
    }
}

export default {
    getConnection
}