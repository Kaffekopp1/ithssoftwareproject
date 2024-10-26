import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
export default function Polls() {
	const [pollData, setPollData] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		async function fetcher() {
			try {
				setLoading(true);
				const response = await fetch("/api/poll");
				const data = await response.json();
				console.log(data);
				if (data[0]) {
					setPollData(data);
				}
			} catch (error) {
				alert("error fel på servern", error);
			} finally {
				setLoading(false);
			}
		}
		fetcher();
	}, []);

	return (
		<div>
			<h1>Polls</h1>
			{loading ? (
				<p>Laddar..</p>
			) : (
				pollData &&
				pollData?.map((value) => (
					<div key={value.id}>
						<Link to={`/poll/${value?.id}`}>{value?.question}</Link>
					</div>
				))
			)}
		</div>
	);
}
