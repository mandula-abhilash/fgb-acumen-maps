export async function up(knex) {
  // Ensure extensions are enabled before creating the table
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "postgis"');

  const result = await knex.raw("SELECT current_user;");

  return knex.schema.createTable("live_opportunities", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("site_name").notNullable();
    table.string("site_address").notNullable();
    table.specificType("lpa", "text[]").notNullable();
    table.specificType("region", "text[]").notNullable();
    table.string("developer_name").notNullable();
    table.string("developer_region");
    table.integer("plots").notNullable();
    table.specificType("tenures", "text[]").notNullable();
    table.string("google_maps_link").notNullable();
    table.string("planning_status").notNullable();
    table.string("land_purchase_status").notNullable();
    table.date("start_on_site_date");
    table.date("handover_date");
    table.text("developer_info");
    table.text("site_context");
    table.text("planning_overview");
    table.text("proposed_development");
    table.text("detailed_tenure_accommodation");
    table.text("payment_terms");
    table.text("project_programme");
    table.text("agent_terms");

    // PostGIS support
    table.specificType("geom", "GEOMETRY(Point, 4326)");

    // MongoDB User Reference (storing MongoDB's ObjectId as string)
    table.string("mongo_user_id").notNullable();
    table.index("mongo_user_id");

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable("live_opportunities");
}
