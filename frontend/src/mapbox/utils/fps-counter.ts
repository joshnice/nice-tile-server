export class FpsCounter {

    private fpsValues: FpsValues | undefined;

    constructor() {
    }

    private measureFps() {
        let previousMeasurement = performance.now();
        const fn = () => {
            const currentMeasurement = performance.now();
            // Get the amount of time in seconds between this render and the last
            const fps = 1000 / (currentMeasurement - previousMeasurement);
            this.fpsValues?.pushValue(fps, currentMeasurement);
            previousMeasurement = currentMeasurement;
            requestAnimationFrame(fn);
        }
        requestAnimationFrame(fn)
    }

    public start() {
        this.fpsValues = new FpsValues();
        this.measureFps();
    }

    public stop() {
        this.fpsValues?.remove();
    }
}

class FpsValues {

    private fpsValuesSinceLastUpdate: number[] = [];

    private lastUpdate = performance.now();

    private valueDisplayElement: HTMLParagraphElement = document.createElement("p");

    private containerElement: HTMLDivElement = document.createElement("div");

    constructor() {
        this.createFpsElements();
    }

    public pushValue(latestFpsValue: number, timeOfLatestValue: number) {
        if (this.lastUpdate + 1000 <= timeOfLatestValue) {
            // Work out average of previous FPS values
            const total = this.fpsValuesSinceLastUpdate.reduce((total, value) => total + value, 0);
            const average = total / this.fpsValuesSinceLastUpdate.length;

            // Rest values
            this.lastUpdate = timeOfLatestValue;
            this.fpsValuesSinceLastUpdate = [];

            // Display Fps Total
            this.valueDisplayElement.innerText = average.toFixed(0);
        } else {
            // Add it to the total
            this.fpsValuesSinceLastUpdate.push(latestFpsValue);
        }
    }

    private createFpsElements() {
        this.containerElement.style.position = "absolute";
        this.containerElement.style.top = "0px";
        this.containerElement.style.right = "0px";
        this.containerElement.style.width = "40px";
        this.containerElement.style.height = "20px";
        this.containerElement.style.backgroundColor = "black";
        this.containerElement.style.zIndex = "1000";

        this.valueDisplayElement.innerText = "0";
        this.valueDisplayElement.style.color = "#0FFF50";
        this.containerElement.appendChild(this.valueDisplayElement);

        document.body.appendChild(this.containerElement);
    }

    public remove() {
        this.containerElement.remove();
        this.valueDisplayElement.remove();
    }
}