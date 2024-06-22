import MapPageComponent from "./components/pages/map";
import "./App.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="map-container">
				<MapPageComponent />
			</div>
		</QueryClientProvider>
	);
}

export default App;
