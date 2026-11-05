-- Add QRNova subscription plan.
-- Existing users will automatically remain on the free plan.

ALTER TABLE users
ADD COLUMN subscription_plan TEXT NOT NULL DEFAULT 'free';