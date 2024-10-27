import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Poll() {
	const { pollId } = useParams();
	const [pollInfo, setPollInfo] = useState();
	const [loading, setLoading] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const navigate = useNavigate();

	async function deletePoll() {
		try {
			const response = await fetch(`/api/poll`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: pollId
				})
			});
			const data = await response.json();
			alert(`poll raderad: ${data.deleted}`);
			navigate("/");
		} catch (error) {
			alert("Något gick fel", error);
		} finally {
			setLoading(false);
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
			{loading ? (
				<p>Laddar... </p>
			) : (
				<div className="poll-container">
					<>
						<h3>{pollInfo?.question}</h3>
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
					</>

					{pollInfo?.alternatives && (
						<>
							<h4>Fråga skapad av:</h4>
							<p>{pollInfo?.creator_name}</p>
							<button onClick={deletePoll}>Ta bort Poll</button>
						</>
					)}
				</div>
			)}
		</div>
	);
}
