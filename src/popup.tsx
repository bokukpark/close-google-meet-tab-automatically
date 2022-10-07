import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {
    DomainEventExitThresholdChanged,
    DomainEventGetCurrentNumberOfParticipants, DomainEventGetExitThreshold,
    DomainEventMonitoringEnabledChanged, StorageKeys,
} from "./model";

const Popup = () => {
    const [numParticipants, setNumParticipants] = useState<string>("N/A");
    const [threshold, setThreshold] = useState<number | undefined>(0);

    const [currentURL, setCurrentURL] = useState<string>();
    const [enabled, setEnabled] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            setCurrentURL(tabs[0].url);
        });

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0];
            if (tab.id) {
                chrome.tabs.sendMessage(
                    tab.id,
                    new DomainEventGetCurrentNumberOfParticipants(),
                    (msg) => {
                        if (msg != undefined) {
                            setNumParticipants(msg)
                        } else {
                            setNumParticipants("N/A")
                        }
                    }
                );
            }
        })

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0];
            if (tab.id) {
                chrome.tabs.sendMessage(
                    tab.id,
                    new DomainEventGetExitThreshold(),
                    (msg) => {
                        if (msg != undefined) {
                            setThreshold(msg)
                        } else {
                            setThreshold(undefined)
                        }
                    }
                );
            }
        })
    }, [enabled, threshold, numParticipants, errorMessage]);

    const changeThreshold = (newValue: number) => {
        if (newValue != threshold) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const tab = tabs[0];
                if (tab.id) {
                    console.log('Threshold Changed: ', newValue)
                    chrome.tabs.sendMessage(
                        tab.id,
                        new DomainEventExitThresholdChanged(newValue),
                        (msg) => {
                            console.log("result message:", msg);
                            setThreshold(newValue)
                        }
                    );
                }
            });
        }
    };

    return (
        <>
            <ul style={{minWidth: "700px"}}>
                <li>Current URL: {currentURL}</li>
                <li>Current #Participants: {numParticipants}
                </li>
                <li>Threshold: {threshold}</li>
            </ul>

            <button
                onClick={() => {
                    changeThreshold(2)
                }}
                style={{marginRight: "5px"}}
            >
                2명 이하
            </button>

            <button
                onClick={() => {
                    changeThreshold(3)
                }}
                style={{marginRight: "5px"}}
            >
                3명 이하
            </button>

            <button
                onClick={() => {
                    changeThreshold(4)
                }}
                style={{marginRight: "5px"}}
            >
                4명 이하
            </button>

            <button
                onClick={() => {
                    changeThreshold(5)
                }}
                style={{marginRight: "5px"}}
            >
                5명 이하
            </button>

            <br/>
            <br/>
            <button
                onClick={() => {
                    changeThreshold(10)
                }}
                style={{marginRight: "5px"}}
            >
                10명 이하
            </button>

            <button
                onClick={() => {
                    changeThreshold(20)
                }}
                style={{marginRight: "5px"}}
            >
                20명 이하
            </button>

            <button
                onClick={() => {
                    changeThreshold(40)
                }}
                style={{marginRight: "5px"}}
            >
                40명 이하
            </button>

            <br/>
            <br/>
            <button
                onClick={() => {
                    setEnabled(true)
                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        const tab = tabs[0];
                        if (tab.id) {
                            chrome.tabs.sendMessage(
                                tab.id,
                                new DomainEventMonitoringEnabledChanged(true),
                                (msg) => {
                                    if (msg.success == false) {
                                        setErrorMessage(msg.message)
                                    } else {
                                        setErrorMessage("")
                                    }
                                }
                            );
                        }
                    });
                    console.log("Enabled Clicked!")
                }
                }
                style={{marginRight: "5px"}}
            >
                자동 탈출 활성화 🟢
            </button>

            <button
                onClick={() => {
                    setEnabled(false)
                    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                        const tab = tabs[0];
                        if (tab.id) {
                            chrome.tabs.sendMessage(
                                tab.id,
                                new DomainEventMonitoringEnabledChanged(false),
                                (msg) => {
                                    setErrorMessage(undefined)
                                    console.log("result message:", msg);
                                }
                            );
                        }
                    });
                    console.log("Disabled Clicked!")
                }}
                style={{marginRight: "5px"}}
            >
                자동 탈출 비활성화 🔴
            </button>

            {errorMessage != undefined &&
                <h3 style={{color: "red"}}>
                    {errorMessage}
                </h3>
            }
        </>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Popup/>
    </React.StrictMode>,
    document.getElementById("root")
);
