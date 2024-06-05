import { useRef } from "react";
import { BehaviorSubject } from "rxjs";

export default function useMapLoaded() {
    const subject = useRef(new BehaviorSubject<boolean>(false));
    return { $mapLoaded: subject };
}