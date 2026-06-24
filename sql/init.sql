IF NOT EXISTS (
    SELECT *
    FROM sys.databases
    WHERE name = 'patito_db'
)
BEGIN
    CREATE DATABASE patito_db;
END
GO