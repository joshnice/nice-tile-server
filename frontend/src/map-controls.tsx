import { PropsWithChildren } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquare } from "@fortawesome/free-regular-svg-icons/faSquare";
import { faCircle } from "@fortawesome/free-regular-svg-icons/faCircle";
import { faSlash } from "@fortawesome/free-solid-svg-icons/faSlash";

export type Control = "Point" | "Line" | "Area";

export default function MapControlsComponent({ selectedControl, onControlClick }: { selectedControl: Control | null, onControlClick: (type: Control) =>  void}) {
    return (
        <div className="map-controls-container">
            <ControlComponent selected={selectedControl === "Area"} onClick={() => onControlClick("Area")}>
                <FontAwesomeIcon className="map-control-icon" icon={faSquare} />
            </ControlComponent>
            <ControlComponent selected={selectedControl === "Line"} onClick={() => onControlClick("Line")} >
                <FontAwesomeIcon className="map-control-icon" icon={faSlash} />
            </ControlComponent>
            <ControlComponent selected={selectedControl === "Point"} onClick={() => onControlClick("Point")} >
                <FontAwesomeIcon className="map-control-icon" icon={faCircle} />
            </ControlComponent>
        </div>
    )
} 

function ControlComponent({ selected, onClick, children }: PropsWithChildren<{ selected: boolean, onClick: () => void }>) {
    return <button type="button" className="map-control" onClick={onClick} style={{ backgroundColor: selected ? "lightblue" : "white" }} >{children}</button>
}