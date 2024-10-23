import Fastify from "fastify";
import knex from "knex";
import dotenv from "dotenv";

dotenv.config();
const server = Fastify({ logger: true });

// MySQL database connection using Knex
const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 7 }, // optional: manage connection pool
});

// Basic route
server.get("/", async (req, res) => {
  res.send({ message: "Hello World" });
});

// Route to get users from MySQL
server.get("/users", async (req, res) => {
  try {
    const users = await db.select().from("users");
    res.send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

//add the new review
server.post("/reviews", async (req, res) => {
  const { user_id, content, rating, tags, reviewer_id } = req.body;

  try {
    const [newReview] = await db("reviews").insert({
      user_id,
      content,
      rating,
      tags,
      reviewer_id,
      reviewed_on: new Date(), // Assuming you want to store the creation timestamp
    }); // Return the newly created review

    res.status(201).send(newReview);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).send({ error: "Failed to add review" });
  }
});

//update the review
server.put("/reviews/:id", async (req, res) => {
  const { id } = req.params; // Get the review ID from the URL
  const { content, rating, tags } = req.body; // Get the updated data from the request body

  try {
    // Check if the review exists
    const [existingReview] = await db("reviews").where("id", id);
    if (!existingReview) {
      return res.status(404).send({ error: "Review not found" });
    }

    // Update the review
    await db("reviews").where("id", id).update({
      content,
      rating,
      tags,
      reviewed_on: new Date(), // Assuming you want to store the update timestamp
    });

    // Optionally, fetch and return the updated review
    const updatedReview = await db("reviews").where("id", id).first();
    res.send(updatedReview);
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).send({ error: "Failed to update review" });
  }
});

//route to get reviews from MySQL

server.get("/reviews/:id", async (req, res) => {
  const { page, limit } = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const offset = (pageNumber - 1) * limitNumber;

  try {
    const [reviews, totalCountResult] = await Promise.all([
      db
        .select()
        .from("reviews")
        .where("user_id", req.params.id)
        .limit(limitNumber)
        .offset(offset),
      db("users").count("id as count").first(),
    ]);

    const total = totalCountResult.count;
    res.send({
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      reviews,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

// Route to get specific user from MySQL
server.get("/users/:id", async (req, res) => {
  try {
    const users = await db.select().from("users").where("id", req.params.id);
    const awards = await db
      .select()
      .from("awards")
      .where("user_id", req.params.id);
    const licenes = await db
      .select()
      .from("licenses")
      .where("user_id", req.params.id);
    const work_experiences = await db
      .select()
      .from("work_experience")
      .where("user_id", req.params.id);
    const cheer = await db
      .select()
      .from("cheer")
      .where("user_id", req.params.id)
      .count("id as cheers");
    const about = {
      user: users,
      awards: awards,
      licenes: licenes,
      work_experiences: work_experiences,
      cheers: cheer,
    };
    res.send(about);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

// Start the Fastify server
server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
