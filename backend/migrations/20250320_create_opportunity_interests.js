/*
  # Create Opportunity Interests Table

  1. New Tables
    - `opportunity_interests`
      - `id` (uuid, primary key)
      - `opportunity_id` (uuid, foreign key)
      - `user_id` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Notes
    - Links users to opportunities they've expressed interest in
    - Unique constraint on user_id + opportunity_id to prevent duplicate interests
*/

export async function up(knex) {
  return knex.raw(`
      CREATE TABLE IF NOT EXISTS opportunity_interests (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        opportunity_id uuid NOT NULL REFERENCES live_opportunities(id) ON DELETE CASCADE,
        user_id text NOT NULL,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        UNIQUE(opportunity_id, user_id)
      );
  
      CREATE INDEX opportunity_interests_user_id_idx ON opportunity_interests(user_id);
      CREATE INDEX opportunity_interests_opportunity_id_idx ON opportunity_interests(opportunity_id);
    `);
}

export async function down(knex) {
  return knex.raw(`
      DROP TABLE IF EXISTS opportunity_interests;
    `);
}
