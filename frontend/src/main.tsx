import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "mapbox-gl/dist/mapbox-gl.css";
import * as Sentry from "@sentry/react";

Sentry.init({
	dsn: "https://ecbe4c25432390e946cd17e7df52807d@o4507078072532992.ingest.de.sentry.io/4507078074499152",
	integrations: [
		Sentry.replayIntegration(),
		Sentry.replayCanvasIntegration(),
	],

	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
