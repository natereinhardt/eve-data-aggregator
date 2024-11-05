CREATE OR REPLACE VIEW combined_all_journal_entries AS 
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Holdings' AS corporation
FROM S0b.1_journal_entries AS je
JOIN S0b.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Holdings' AS corporation
FROM S0b.2_journal_entries AS je
JOIN S0b.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Holdings' AS corporation
FROM S0b.3_journal_entries AS je
JOIN S0b.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Holdings' AS corporation
FROM S0b.4_journal_entries AS je
JOIN S0b.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Holdings' AS corporation
FROM S0b.5_journal_entries AS je
JOIN S0b.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Holdings' AS corporation
FROM S0b.6_journal_entries AS je
JOIN S0b.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Holdings' AS corporation
FROM S0b.7_journal_entries AS je
JOIN S0b.wallets AS w ON je.wallet_division = w.Id
-- Now add S0b_Struct database tables with the corporation name 'S0b Structure Management'
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Structure Management' AS corporation
FROM S0b_Struct.1_journal_entries AS je
JOIN S0b_Struct.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Structure Management' AS corporation
FROM S0b_Struct.2_journal_entries AS je
JOIN S0b_Struct.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Structure Management' AS corporation
FROM S0b_Struct.3_journal_entries AS je
JOIN S0b_Struct.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Structure Management' AS corporation
FROM S0b_Struct.4_journal_entries AS je
JOIN S0b_Struct.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Structure Management' AS corporation
FROM S0b_Struct.5_journal_entries AS je
JOIN S0b_Struct.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Structure Management' AS corporation
FROM S0b_Struct.6_journal_entries AS je
JOIN S0b_Struct.wallets AS w ON je.wallet_division = w.Id
UNION ALL
SELECT je.*, 
       CAST(je.date AS DATE) AS entry_date,
       w.Name AS wallet_division_name,
       'S0b Structure Management' AS corporation
FROM S0b_Struct.7_journal_entries AS je
JOIN S0b_Struct.wallets AS w ON je.wallet_division = w.Id;
