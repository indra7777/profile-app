/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").defaultTo(knex.fn.uuid()).primary();
      table.uuid("google_id").nullable();
      table.uuid("fb_id").nullable();
      table.uuid("insta_id").nullable();
      table.string("name").notNullable();
      table.string("email_id").notNullable().unique();
      table.string("password").notNullable();
      table.string("about_me").nullable();
      table.string("education").nullable();
      table.string("skills").nullable();
      table.string("profile_pic_link").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.enu("user_type", ["creator", "consumer"]).notNullable();
    })
    .createTable("licenses", (table) => {
      table.uuid("id").defaultTo(knex.fn.uuid());
      table.uuid("user_id").notNullable().references("id").inTable("users");
      table.string("title").notNullable();
      table.string("cred_id").notNullable();
      table.string("cred_link").notNullable();
      table.timestamp("issued_on").notNullable();
    })
    .createTable("work_experience", (table) => {
      table.uuid("id").defaultTo(knex.fn.uuid());
      table.uuid("user_id").notNullable().references("id").inTable("users");
      table.string("title").notNullable();
      table.string("company").notNullable();
      table.string("description").notNullable();
      table.timestamp("start_date").notNullable();
      table.timestamp("end_date").notNullable();
    })
    .createTable("awards", (table) => {
      table.uuid("id").defaultTo(knex.fn.uuid());
      table.uuid("user_id").notNullable().references("id").inTable("users");
      table.string("title").notNullable();
      table.string("description").notNullable();
      table.timestamp("rewarded_on").notNullable();
    })
    .createTable("reviews", (table) => {
      table.uuid("id").defaultTo(knex.fn.uuid());
      table.uuid("user_id").notNullable().references("id").inTable("users");
      table.uuid("reviewee_id").notNullable().references("id").inTable("users");
      table.string("tags").notNullable();
      table.string("content").notNullable();
      table.float("rating").notNullable();
      table.timestamp("reviewed_on").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("cheer", (table) => {
      table.uuid("id").defaultTo(knex.fn.uuid());
      table.uuid("user_id").notNullable().references("id").inTable("users");
      table.uuid("cheerer_id").notNullable().references("id").inTable("users");
      table.timestamp("cheered_on").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("users")
    .dropTable("licenses")
    .dropTable("work_experience")
    .dropTable("awards")
    .dropTable("reviews")
    .dropTable("cheer");
};
