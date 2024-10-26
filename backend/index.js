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
		const { rows } = await client.query("SELECT * FROM poll");
		response.send(rows);
	} catch (error) {
		response.send(error);
	}
});

app.patch("/api/vote", async (_request, response) => {
	const { id } = _request.body;
	const { rows } = await client.query(
		"update alternative set votes = votes + 1 where id = $1 ",
		[id]
	);
	response.send(rows);
});

app.get("/api/get/poll/:id", async (_request, response) => {
	const { id } = _request.params;
	try {
		const { rows } = await client.query(
			"SELECT poll.*, jsonb_agg(jsonb_build_object('id', alternative.id, 'alternative', alternative.alternative, 'votes', alternative.votes) order by alternative.id) AS alternatives FROM poll JOIN alternative ON poll.id = alternative.poll_id WHERE poll.id = $1 GROUP BY poll.id; ",
			[id]
		);
		response.send(rows);
	} catch (error) {
		response.send(error);
	}
});

app.post("/api/poll", async (_request, response) => {
	console.log("here", _request.body);
	const { creatorName, question, alternatives } = _request.body;
	try {
		const { rows } = await client.query(
			"SELECT * FROM create_poll($1, $2, $3)",
			[creatorName, question, alternatives]
		);
		response.send(rows);
	} catch (err) {
		return { err };
	}
});

app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(port, () => {
	console.log(`Redo på http://localhost:${port}/`);
});
