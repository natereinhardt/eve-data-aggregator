-- Create the KryTek database if it doesn't exist
CREATE DATABASE IF NOT EXISTS KryTek;

-- Switch to KryTek database
USE KryTek;

-- Create tables based on S0b structure
CREATE TABLE IF NOT EXISTS 1_journal_entries LIKE S0b.1_journal_entries;
CREATE TABLE IF NOT EXISTS 2_journal_entries LIKE S0b.2_journal_entries;
CREATE TABLE IF NOT EXISTS 3_journal_entries LIKE S0b.3_journal_entries;
CREATE TABLE IF NOT EXISTS 4_journal_entries LIKE S0b.4_journal_entries;
CREATE TABLE IF NOT EXISTS 5_journal_entries LIKE S0b.5_journal_entries;
CREATE TABLE IF NOT EXISTS 6_journal_entries LIKE S0b.6_journal_entries;
CREATE TABLE IF NOT EXISTS 7_journal_entries LIKE S0b.7_journal_entries;
CREATE TABLE IF NOT EXISTS tokens LIKE S0b.tokens;
CREATE TABLE IF NOT EXISTS wallets LIKE S0b.wallets;



CREATE OR REPLACE VIEW KryTek.all_journal_entries AS
SELECT *, CAST(date AS DATE) AS entry_date
FROM KryTek.1_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM KryTek.2_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM KryTek.3_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM KryTek.4_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM KryTek.5_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM KryTek.6_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM KryTek.7_journal_entries;


GRANT ALL PRIVILEGES ON KryTek.* TO S0b_Admin;
