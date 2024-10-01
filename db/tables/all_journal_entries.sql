CREATE VIEW all_journal_entries AS
SELECT * FROM 1_journal_entries
UNION ALL
SELECT * FROM 2_journal_entries
UNION ALL
SELECT * FROM 3_journal_entries
UNION ALL
SELECT * FROM 4_journal_entries
UNION ALL
SELECT * FROM 5_journal_entries
UNION ALL
SELECT * FROM 6_journal_entries
UNION ALL
SELECT * FROM 7_journal_entries;
