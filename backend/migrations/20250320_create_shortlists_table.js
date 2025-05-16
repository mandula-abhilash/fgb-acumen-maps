/*
  # Create Shortlists Table

  1. New Tables
    - `shortlists`
      - `id` (uuid, primary key)
      - `user_id` (text, foreign key)
      - `opportunity_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Notes
    - Links users to their shortlisted opportunities
    - Unique constraint on user_id + opportunity_id to prevent duplicates
*/

export async function up(knex) {
  return knex.raw(`
      CREATE TABLE IF NOT EXISTS shortlists (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id text NOT NULL,
        opportunity_id uuid NOT NULL REFERENCES live_opportunities(id) ON DELETE CASCADE,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        UNIQUE(user_id, opportunity_id)
      );
  
      CREATE INDEX shortlists_user_id_idx ON shortlists(user_id);
      CREATE INDEX shortlists_opportunity_id_idx ON shortlists(opportunity_id);
    `);
}

export async function down(knex) {
  return knex.raw(`
      DROP TABLE IF EXISTS shortlists;
    `);
}
