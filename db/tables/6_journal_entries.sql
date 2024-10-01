
CREATE TABLE 6_journal_entries (
    amount DECIMAL(15, 2),
    balance DECIMAL(15, 2),
    context_id BIGINT,
    context_id_type VARCHAR(255),
    date DATETIME,
    description TEXT,
    first_party_id BIGINT,
    id BIGINT,
    reason TEXT,
    ref_type VARCHAR(255),
    second_party_id BIGINT,
    wallet_division SMALLINT,
    transaction_type TINYINT,
    unique_id VARCHAR(255) GENERATED ALWAYS AS (CONCAT(id, '-', wallet_division)) STORED, -- Stored Generated Column
    PRIMARY KEY (id, wallet_division), -- Composite Primary Key
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_date (date),
    INDEX idx_context_id_type (context_id_type)
);