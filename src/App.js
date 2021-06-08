import React from "react";
import {render} from "react-dom";
import {useEffect, useState} from "react";
import {interval, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {fromEvent} from 'rxjs';
import {map, buffer, filter, debounceTime} from 'rxjs/operators';


export default function App() {
    const [sec, setSeconds] = useState(0);
    const [status, setStatus] = useState("stop");

    useEffect(() => {
        const unsubscribe$ = new Subject();
        interval(1000)
            .pipe(takeUntil(unsubscribe$))
            .subscribe(() => {
                if (status === "run") {
                    setSeconds(val => val + 1000);
                }

            });
        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        };
    }, [status]);


    const start = () => {
        setStatus("run");
    }

    const stop = () => {
        setStatus("stop");
        setSeconds(0);
    }

    const reset = () => {
        setSeconds(0);
    }

    const wait = React.useCallback(() => {
        const click$ = fromEvent(document.getElementById("waitBtn"), 'click');
        const doubleClick$ = click$
            .pipe(
                buffer(click$.pipe(debounceTime(300))),
                map(clicks => clicks.length),
                filter(clicksLength => clicksLength >= 2)
            );

        doubleClick$.subscribe(() => {
            setStatus("wait");
        });


    }, []);

    return (
        <div>
            <span> {new Date(sec).toISOString().slice(11, 19)}</span>
            <button  onClick={start}>
                Start
            </button>
            <button onClick={stop}>
                Stop
            </button>
            <button onClick={reset}>Reset</button>
            <button id="waitBtn" onClick={wait}>Wait</button>
        </div>
    );
}

render(<App/>, document.getElementById("root"));