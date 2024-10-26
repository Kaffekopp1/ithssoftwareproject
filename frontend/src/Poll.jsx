import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
export default function Poll() {
	const { pollId } = useParams();
	const [pollInfo, setPollInfo] = useState();
	const [loading, setLoading] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	async function test() {
		try {
			const response = await fetch(`/api/get/poll/${pollId}`);
			const data = await response.json();
			console.log("data", data);
			setPollInfo(data[0]);
		} catch (error) {
			console.log("error", error);
		}
	}

	async function voter(alternativeId) {
		console.log(alternativeId, "test");
		setLoading(true);
		try {
			const response = await fetch("/api/vote", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: alternativeId
				})
			});
			const data = await response.json();
			setRefreshKey(refreshKey + 1);
			console.log("data", data);
		} catch (error) {
			alert(error);
		} finally {
			setLoading(false);
		}
	}
	useEffect(() => {
		async function getPoll() {
			try {
				setLoading(true);
				const response = await fetch(`/api/get/poll/${pollId}`);
				const data = await response.json();
				console.log("data", data);
				setPollInfo(data[0]);
			} catch (error) {
				console.log("error", error);
			} finally {
				setLoading(false);
			}
		}
		getPoll();
	}, [pollId, refreshKey]);

	return (
		<div>
			<h2>{pollInfo?.question}</h2>
			<button onClick={test}>test</button>
			{loading ? (
				<p>Laddar... </p>
			) : (
				<>
					<p>{pollInfo?.question}</p>
					<div className="poll-alternative">
						{pollInfo?.alternatives &&
							pollInfo.alternatives.map((value) => (
								<div key={value.id}>
									<button onClick={() => voter(value.id)}>
										{value.alternative}
									</button>
									<p>{value.votes}</p>
								</div>
							))}
					</div>
					<h2>Fråga skapad av:</h2>
					<p>{pollInfo?.creator_name}</p>
				</>
			)}
		</div>
	);
}
