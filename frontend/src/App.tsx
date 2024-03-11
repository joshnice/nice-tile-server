import MapComponent from "./map";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="map-container">
				<MapComponent />
			</div>
		</QueryClientProvider>
	);
}

export default App;
