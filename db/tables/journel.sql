CREATE TABLE journal_entries (
    amount DECIMAL(15, 2),
    balance DECIMAL(15, 2),
    context_id BIGINT,
    context_id_type VARCHAR(255),
    date DATETIME,
    description TEXT,
    first_party_id BIGINT,
    id BIGINT PRIMARY KEY,
    reason TEXT,
    ref_type VARCHAR(255),
    second_party_id BIGINT,
    wallet_division SMALLINT,
    transaction_type TINYINT,
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_date (date),
    INDEX idx_context_id_type (context_id_type)
);
