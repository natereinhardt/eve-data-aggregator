CREATE TABLE 1_journal_entries LIKE S0b.1_journal_entries;
CREATE TABLE 2_journal_entries LIKE S0b.2_journal_entries;
CREATE TABLE 3_journal_entries LIKE S0b.3_journal_entries;
CREATE TABLE 4_journal_entries LIKE S0b.4_journal_entries;
CREATE TABLE 5_journal_entries LIKE S0b.5_journal_entries;
CREATE TABLE 6_journal_entries LIKE S0b.6_journal_entries;
CREATE TABLE 7_journal_entries LIKE S0b.7_journal_entries;
CREATE TABLE tokens LIKE S0b.tokens;
CREATE TABLE wallets LIKE S0b.wallets;



CREATE OR REPLACE VIEW S0b_Struct.all_journal_entries AS
SELECT *, CAST(date AS DATE) AS entry_date
FROM S0b_Struct.1_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM S0b_Struct.2_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM S0b_Struct.3_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM S0b_Struct.4_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM S0b_Struct.5_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM S0b_Struct.6_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM S0b_Struct.7_journal_entries;


GRANT ALL PRIVILEGES ON S0b_Struct.* TO S0b_Admin;