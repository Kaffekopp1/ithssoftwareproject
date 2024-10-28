const express = require("express"),
	path = require("path");

const dotenv = require("dotenv"),
	{ Client } = require("pg");
dotenv.config();

const client = new Client({
	connectionString: process.env.PGURI
});
client.connect();
const app = express(),
	port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/poll", async (_request, response) => {
	try {
		const { rows } = await client.query(`SELECT * FROM poll`);
		response.send(rows);
	} catch (error) {
		response.status(500).send(error);
	}
});

app.post("/api/poll", async (_request, response) => {
	const { creatorName, question, alternatives } = _request.body;
	try {
		const { rows } = await client.query(
			`SELECT * FROM create_poll($1, $2, $3)`,
			[creatorName, question, alternatives]
		);
		response.status(201).send({ poll: "pollskapad" });
	} catch (error) {
		response.status(500).send(error);
	}
});

app.delete("/api/poll", async (_request, response) => {
	const { id } = _request.body;
	try {
		const { rows } = await client.query(`DELETE FROM poll WHERE id = $1`, [id]);
		response.send({ deleted: "poll is deleted" });
	} catch (error) {
		response.status(500).send(error);
	}
});

app.patch("/api/vote", async (_request, response) => {
	const { id } = _request.body;
	try {
		const { rows } = await client.query(
			`UPDATE alternative SET votes = votes + 1 WHERE id = $1`,
			[id]
		);
		response.send(rows);
	} catch (error) {
		response.status(500).send(error);
	}
});

app.get("/api/get/poll/:id", async (_request, response) => {
	const { id } = _request.params;
	try {
		const { rows } = await client.query(
			`SELECT poll.*, jsonb_agg(jsonb_build_object('id', alternative.id,
			'alternative', alternative.alternative, 'votes', alternative.votes)
			 ORDER BY alternative.id) AS alternatives
			 FROM poll JOIN alternative ON poll.id = alternative.poll_id
			 WHERE poll.id = $1 GROUP BY poll.id; `,
			[id]
		);
		response.send(rows);
	} catch (error) {
		response.status(500).send(error);
	}
});

app.post("/api/discussion", async (_request, response) => {
	const { id, message, sender } = _request.body;
	try {
		await client.query(
			`INSERT INTO discussion (poll_id, message, sender) VALUES ($1, $2, $3)`,
			[id, message, sender]
		);
		response.status(201).send({ meddelande: "meddelande skickat" });
	} catch (error) {
		response.status(500).send(error);
	}
});
app.delete("/api/discussion", async (_request, response) => {
	const { id } = _request.body;
	try {
		await client.query(`DELETE FROM discussion WHERE id = $1`, [id]);
		response.send({ deleted: "message is deleted" });
	} catch (error) {
		response.status(500).send(error);
	}
});

app.get("/api/discussion/:id", async (_request, response) => {
	const { id } = _request.params;

	try {
		const { rows } = await client.query(
			`SELECT * FROM discussion WHERE poll_id = $1`,
			[id]
		);
		response.send(rows);
	} catch (error) {
		response.status(500).send(error);
	}
});
app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(port, () => {
	console.log(`Redo på http://localhost:${port}/`);
});
