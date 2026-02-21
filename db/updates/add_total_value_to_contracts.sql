-- Add total_value column to contract table
-- DECIMAL(20,2) can hold up to 99,999,999,999,999,999.99 (99 quintillion ISK)
ALTER TABLE S0b_Struct.contract 
ADD COLUMN total_value DECIMAL(20,2) DEFAULT NULL;
