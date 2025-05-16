export async function up(knex) {
  // Enable extensions one at a time to ensure proper error handling
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "postgis"');
  return Promise.resolve();
}

export async function down(knex) {
  // Disable extensions in reverse order
  await knex.raw('DROP EXTENSION IF NOT EXISTS "pgcrypto"');
  await knex.raw('DROP EXTENSION IF EXISTS "postgis"');
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
  return Promise.resolve();
}
