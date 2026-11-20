export async function up(knex) {
  await knex.schema.createTable('users', (t) => {
    t.string('id', 100).primary();
    t.string('name', 150).notNullable();
    t.string('email', 255).notNullable().unique();
    t.string('password_hash', 255).notNullable();
    t.string('phone', 50).notNullable().defaultTo('');
    t.text('bio').notNullable().defaultTo('');
    t.string('university', 255).notNullable().defaultTo('');
    t.string('department', 255).notNullable().defaultTo('');
    t.timestamp('created_at').notNullable();
  });
  await knex.schema.createTable('trips', (t) => {
    t.string('id', 100).primary();
    t.string('name', 200).notNullable();
    t.string('destination', 255).notNullable();
    t.string('start_date', 10).notNullable();
    t.string('end_date', 10).notNullable();
    t.integer('budget_paise').notNullable().defaultTo(0);
    t.text('description').notNullable().defaultTo('');
    t.string('invite_code', 100).notNullable().unique();
    t.string('created_by', 100).notNullable().references('id').inTable('users');
    t.decimal('latitude', 10, 6).nullable();
    t.decimal('longitude', 10, 6).nullable();
    t.timestamp('created_at').notNullable();
  });
  await knex.schema.createTable('trip_members', (t) => {
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.string('user_id', 100).notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.enum('role', ['Trip Creator', 'Trip Member']).notNullable();
    t.enum('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('approved');
    t.timestamp('joined_at').notNullable();
    t.primary(['trip_id', 'user_id']);
    t.index(['trip_id']);
  });
  await knex.schema.createTable('itinerary_days', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.integer('day_number').notNullable();
    t.timestamp('created_at').notNullable();
    t.unique(['trip_id', 'day_number']);
  });
  await knex.schema.createTable('activities', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.integer('day_number').notNullable();
    t.string('title', 255).notNullable();
    t.string('time', 10).notNullable();
    t.string('location', 255).notNullable().defaultTo('');
    t.integer('cost_paise').notNullable().defaultTo(0);
    t.text('notes').notNullable().defaultTo('');
    t.integer('sort_order').notNullable().defaultTo(0);
    t.string('created_by', 100).references('id').inTable('users');
  });
  await knex.schema.createTable('suggestions', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.string('title', 255).notNullable();
    t.string('location', 255).notNullable().defaultTo('');
    t.integer('estimated_cost_paise').notNullable().defaultTo(0);
    t.text('notes').notNullable().defaultTo('');
    t.string('author_id', 100).notNullable().references('id').inTable('users');
    t.boolean('status').notNullable().defaultTo(false);
    t.boolean('added_to_itinerary').notNullable().defaultTo(false);
    t.timestamp('created_at').notNullable();
  });
  await knex.schema.table('suggestions', (t) => t.index(['trip_id']));
  await knex.schema.createTable('suggestion_votes', (t) => {
    t.string('suggestion_id', 100).notNullable().references('id').inTable('suggestions').onDelete('CASCADE');
    t.string('user_id', 100).notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('value').notNullable();
    t.primary(['suggestion_id', 'user_id']);
  });
  await knex.schema.createTable('polls', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.string('question', 255).notNullable();
    t.string('created_by', 100).notNullable().references('id').inTable('users');
    t.enum('status', ['open', 'closed']).notNullable().defaultTo('open');
    t.timestamp('created_at').notNullable();
  });
  await knex.schema.createTable('poll_options', (t) => {
    t.string('id', 100).primary();
    t.string('poll_id', 100).notNullable().references('id').inTable('polls').onDelete('CASCADE');
    t.string('text', 255).notNullable();
  });
  await knex.schema.createTable('poll_votes', (t) => {
    t.string('poll_id', 100).notNullable().references('id').inTable('polls').onDelete('CASCADE');
    t.string('option_id', 100).notNullable().references('id').inTable('poll_options').onDelete('CASCADE');
    t.string('user_id', 100).notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.primary(['poll_id', 'user_id']);
  });
  await knex.schema.createTable('expenses', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.string('title', 255).notNullable();
    t.integer('amount_paise').notNullable();
    t.string('payer_id', 100).notNullable().references('id').inTable('users');
    t.string('date', 10).notNullable();
  });
  await knex.schema.createTable('expense_participants', (t) => {
    t.string('expense_id', 100).notNullable().references('id').inTable('expenses').onDelete('CASCADE');
    t.string('user_id', 100).notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.primary(['expense_id', 'user_id']);
  });
  await knex.schema.createTable('discussion_posts', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.string('author_id', 100).notNullable().references('id').inTable('users');
    t.text('content').notNullable();
    t.timestamp('created_at').notNullable();
  });
  await knex.schema.createTable('discussion_replies', (t) => {
    t.string('id', 100).primary();
    t.string('post_id', 100).notNullable().references('id').inTable('discussion_posts').onDelete('CASCADE');
    t.string('author_id', 100).notNullable().references('id').inTable('users');
    t.text('content').notNullable();
    t.timestamp('created_at').notNullable();
  });
  await knex.schema.createTable('notifications', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.string('user_id', 100).notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('category', 50).notNullable();
    t.string('message', 500).notNullable();
    t.string('link', 255).notNullable().defaultTo('');
    t.boolean('is_read').notNullable().defaultTo(false);
    t.timestamp('created_at').notNullable();
    t.index(['user_id', 'is_read', 'created_at']);
  });
  await knex.schema.createTable('packing_items', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.string('title', 255).notNullable();
    t.string('assignee_id', 100).nullable().references('id').inTable('users');
    t.boolean('packed').notNullable().defaultTo(false);
  });
  await knex.schema.createTable('join_requests', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.string('user_id', 100).notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.enum('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
    t.timestamp('requested_at').notNullable();
  });
  await knex.schema.createTable('trip_updates', (t) => {
    t.string('id', 100).primary();
    t.string('trip_id', 100).notNullable().references('id').inTable('trips').onDelete('CASCADE');
    t.string('text', 500).notNullable();
    t.timestamp('created_at').notNullable();
  });
  await knex.schema.createTable('weather_cache', (t) => {
    t.string('destination', 255).primary();
    t.text('payload').notNullable();
    t.timestamp('expires_at').notNullable();
  });
}

export async function down(knex) {
  for (const name of ['weather_cache','trip_updates','join_requests','packing_items','notifications','discussion_replies','discussion_posts','expense_participants','expenses','poll_votes','poll_options','polls','suggestion_votes','suggestions','activities','itinerary_days','trip_members','trips','users']) {
    await knex.schema.dropTableIfExists(name);
  }
}
