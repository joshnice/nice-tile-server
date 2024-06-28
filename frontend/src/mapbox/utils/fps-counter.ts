export class FpsCounter {

    private fpsValues: FpsValues | undefined;

    constructor() {
    }

    private measureFps() {
        let previousMeasurement = performance.now();
        const fn = () => {
            const currentMeasurement = performance.now();
            const fps = 1000 / (currentMeasurement - previousMeasurement);
            this.fpsValues?.pushValue(fps);
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

    private values: number[];

    private total = 0;

    private valueDisplayElement: HTMLParagraphElement = document.createElement("p");

    private containerElement: HTMLDivElement = document.createElement("div");

    constructor() {
        this.values = [];
        this.createFpsElements();
    }

    public pushValue(value: number) {
        if (this.values.length >= 60) {
            const firstValue = this.values.shift() ?? 0;
            this.total = this.total - firstValue + value;
        } else {
            this.total += value;
        }

        this.values.push(value);
        const average = this.total / this.values.length
        this.valueDisplayElement.innerText = average.toFixed(2);
    }

    private createFpsElements() {
        this.containerElement.style.position = "absolute";
        this.containerElement.style.top = "0px";
        this.containerElement.style.left = "0px";
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