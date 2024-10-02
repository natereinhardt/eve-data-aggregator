CREATE OR REPLACE VIEW all_journal_entries AS
SELECT *, CAST(date AS DATE) AS entry_date
FROM 1_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM 2_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM 3_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM 4_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM 5_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM 6_journal_entries
UNION ALL
SELECT *, CAST(date AS DATE) AS entry_date
FROM 7_journal_entries;