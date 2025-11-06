CREATE TYPE transaction_type AS ENUM (
    'deposit',
    'withdrawal',
    'transfer_in',
    'transfer_out',
    'giveaway_created',
    'giveaway_redeemed',
    'giveaway_refund'
);

ALTER TABLE transactions
ALTER COLUMN type TYPE transaction_type
USING type::transaction_type;