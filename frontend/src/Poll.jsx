import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Poll() {
	const { pollId } = useParams();
	const [pollInfo, setPollInfo] = useState();
	const [loading, setLoading] = useState(false);
	const [discussionLoad, setDiscussionLoad] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [message, setMessage] = useState("");
	const [name, setName] = useState("");
	const [openDiscussion, setOpenDiscussion] = useState(false);
	const [discussion, setDiscussion] = useState([]);

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
	async function deleteMessage(id) {
		try {
			const response = await fetch(`/api/discussion`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: id
				})
			});
			const data = await response.json();
			alert(`medelande raderad: ${data.deleted}`);
			getDiskussion();
		} catch (error) {
			alert("Något gick fel", error);
		} finally {
			setLoading(false);
		}
	}
	async function sendMessage() {
		try {
			await fetch(`/api/discussion`, {
				method: "Post",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: pollId,
					message: message,
					sender: name
				})
			});
			setName("");
			setMessage("");
			getDiskussion();
		} catch (error) {
			alert("Något gick fel", error);
		} finally {
			setLoading(false);
		}
	}
	async function voter(alternativeId) {
		setLoading(true);
		try {
			await fetch("/api/vote", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					id: alternativeId
				})
			});
			setRefreshKey(refreshKey + 1);
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

				setPollInfo(data[0]);
			} catch (error) {
				console.log("error", error);
			} finally {
				setLoading(false);
			}
		}
		getPoll();
	}, [pollId, refreshKey]);

	async function getDiskussion() {
		try {
			setDiscussionLoad(true);
			const response = await fetch(`/api/discussion/${pollId}`);
			const data = await response.json();
			setDiscussion(data);
		} catch (error) {
			console.log("error", error);
		} finally {
			setDiscussionLoad(false);
			setOpenDiscussion(true);
		}
	}

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
					<div></div>
				</div>
			)}
			<button onClick={getDiskussion}>Öppna diskussion</button>
			{openDiscussion &&
				discussion.length >= [0] &&
				(discussionLoad ? (
					<p>Laddar.. </p>
				) : (
					<div className="poll-container">
						<button onClick={() => setOpenDiscussion(false)}>
							stäng diskussion
						</button>
						<h2>diskussion:</h2>
						<div>
							{discussion.map((value) => (
								<div className="message" key={value.id}>
									<p>{value.message}</p>
									<p>Avsändare: {value?.sender}</p>
									<button onClick={() => deleteMessage(value.id)}>
										Ta bort meddelande
									</button>
								</div>
							))}
							<div>
								<textarea
									onChange={(event) => setMessage(event.target.value)}
									value={message}
									className="diskussion-input"
									placeholder="meddelande"></textarea>
								<div>
									<input
										onChange={(event) => setName(event.target.value)}
										value={name}
										placeholder="Namn"
									/>
								</div>
								<button onClick={sendMessage}> Skicka</button>
							</div>
						</div>
					</div>
				))}
		</div>
	);
}
