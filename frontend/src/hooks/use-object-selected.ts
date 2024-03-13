import { useEffect, useRef, useState } from "react";
import { Subject } from "rxjs";

export default function useObjectSelected() {
    const subject = useRef(new Subject<string | null>());
    const [selectedObject, setSelectedObject] = useState<string | null>(null)

    useEffect(() => {
        const subscription = subject.current.subscribe((selectedObjectId) => {
            console.log("selectedObjectId", selectedObjectId);
            setSelectedObject(selectedObjectId);
        });

        return () => {
            subscription.unsubscribe();
        }

    }, []);

    return { onObjectSelected: subject.current, selectedObject };
}