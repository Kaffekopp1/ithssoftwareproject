import { useState } from "react";

export default function CreatePoll() {
	const [name, setName] = useState("");
	const [question, setQuestion] = useState("");
	const [alternative, setAlternative] = useState("");
	const [alternatives, setAlternatives] = useState([]);
	const [loading, setLoading] = useState(false);

	async function pollCreater() {
		if (question == "" || name == "" || alternatives < 1) {
			alert("fyll i alla alternativ");
			return;
		}
		try {
			setLoading(true);
			await fetch("api/poll", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					creatorName: name,
					question: question,
					alternatives: alternatives
				})
			});
			alert("din poll är skapad se den i fliken polls");
			setAlternatives([]);
			setQuestion("");
			setName("");
		} catch (error) {
			alert("Server strul:");
			console.error("Error vid api:", error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<h1>CreatePoll</h1>
			{loading ? (
				<p>laddar</p>
			) : (
				<>
					<div className="form">
						<label>Skriv ditt namn:</label>
						<input
							onChange={(event) => setName(event.target.value)}
							value={name}
						/>
						<label>Skriv din fråga:</label>
						<input
							onChange={(event) => setQuestion(event.target.value)}
							value={question}
						/>
						<div>
							<label>Skriv ett alternativ: </label>
							<input
								onChange={(event) => setAlternative(event.target.value)}
								value={alternative}
							/>
							<button
								onClick={() =>
									setAlternatives(
										[...alternatives, alternative],
										setAlternative("")
									)
								}>
								Lägg till
							</button>
						</div>
						<button onClick={pollCreater}>Skapa poll</button>
					</div>
					<h4>Inlagda alternativ:</h4>
					{alternatives.map((value, index) => (
						<div key={index}>
							<p>{value}</p>
						</div>
					))}
				</>
			)}
		</>
	);
}
