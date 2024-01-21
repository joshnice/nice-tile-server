import { PropsWithChildren } from "react"

export default function MapControlsComponent({ onControlClick }: { onControlClick: (type: "Point" | "Line" | "Area") =>  void}) {
    return (
        <div className="map-controls-container">
            <ControlComponent onClick={() => onControlClick("Area")}>A</ControlComponent>
            <ControlComponent onClick={() => onControlClick("Line")} >L</ControlComponent>
            <ControlComponent onClick={() => onControlClick("Point")} >P</ControlComponent>
        </div>
    )
} 

function ControlComponent({ onClick, children }: PropsWithChildren<{ onClick: () => void }>) {
    return <button type="button" className="map-control" onClick={onClick}>{children}</button>
}