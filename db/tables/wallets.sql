-- Create the table
CREATE TABLE wallets (
    Id INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL
);

-- Insert the data
INSERT INTO wallets (Id, Name) VALUES
(1, 'Master Wallet'),
(2, 'S0b Market Account'),
(3, 'S0b Sov Expense Account'),
(4, 'Srp Alliance Fund'),
(5, 'S0b Buy Back Account'),
(6, 'S0b Production Wallet'),
(7, 'S0b Rental Wallet');
