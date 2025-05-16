export function up(knex) {
  return knex.schema.createTable("live_opportunity_tags", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("opportunity_id")
      .references("id")
      .inTable("live_opportunities")
      .onDelete("CASCADE");
    table.string("tag").notNullable();
  });
}

export function down(knex) {
  return knex.schema.dropTable("live_opportunity_tags");
}
