import {
    DomainEventExitThresholdChanged,
    DomainEventMonitoringEnabledChanged,
    DomainEventSetBadgeText,
    DomainEventExitGoogleMeet, DomainEventType,
    StorageKeys, DomainEventSetBadgeBackgroundColor
} from "./model";

let monitoringBackground: NodeJS.Timeout | undefined = undefined
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.info('Content - Received a event: ', request)

    switch (request.type) {
        case DomainEventType.GET_CURRENT_NUMBER_OF_PARTICIPANTS:
            sendResponse(getCurrentNumberOfPeopleWhoParticipated() ?? "N/A")
            break

        case DomainEventType.GET_EXIT_THRESHOLD:
            sendResponse(getThresholdToExit())
            break

        case DomainEventType.MONITORING_ENABLED_CHANGED:
            const monitoringEnabledChangedEvent = request as DomainEventMonitoringEnabledChanged

            if (monitoringEnabledChangedEvent.enabled) {
                console.info(window.location.href)
                const numParticipatedPeople = getCurrentNumberOfPeopleWhoParticipated()
                if (window.location.href.match('https://meet.google.com/.+') &&
                    numParticipatedPeople && numParticipatedPeople > 0) {

                    if (getThresholdToExit() == undefined) {
                        console.info('탈출 임계값을 먼저 설정 후 시작해주세요.')
                        sendResponse({success: false, message: '탈출 임계값을 먼저 설정 후 시작해주세요.'})
                    } else {
                        if (monitoringBackground != undefined) {
                            clearInterval(monitoringBackground)
                        }

                        sessionStorage.setItem(StorageKeys.EXIT_GOOGLE_MEET_URL, window.location.href)
                        console.info('탈출 모니터링을 시작합니다.')
                        monitoringBackground = setInterval(() => {
                            monitoringNumOfPeopleToExit()
                        }, 1000)
                        chrome.runtime.sendMessage(new DomainEventSetBadgeBackgroundColor("green"))
                        sendResponse({success: true})
                    }

                } else {
                    console.info('탈출 모니터링은 https://meet.google.com 화상회의에 참여중에만 가능합니다.')
                    chrome.runtime.sendMessage(new DomainEventSetBadgeText(getThresholdToExit()?.toString() ?? "N/A"))
                    chrome.runtime.sendMessage(new DomainEventSetBadgeBackgroundColor("red"))
                    sendResponse({success: false, message: '탈출 모니터링은 https://meet.google.com 화상회의에 참여중에만 가능합니다.'})
                }

            } else {
                if (monitoringBackground != undefined) {
                    clearInterval(monitoringBackground)
                }
                console.info('탈출 모니터링을 중지합니다.')
                chrome.runtime.sendMessage(new DomainEventSetBadgeText(getThresholdToExit()?.toString() ?? "N/A"))
                chrome.runtime.sendMessage(new DomainEventSetBadgeBackgroundColor("red"))
                sendResponse({'success': true})
            }
            break

        case DomainEventType.NUMBER_OF_PARTICIPANTS_CHANGED:
            break

        case DomainEventType.EXIT_THRESHOLD_CHANGED:
            const exitThresholdChangedEvent = request as DomainEventExitThresholdChanged
            if (exitThresholdChangedEvent.lessOrEqualThan.toString() != sessionStorage.getItem(StorageKeys.NUM_PARTICIPANTS_TO_EXIT_THRESHOLD)) {
                sessionStorage.setItem(StorageKeys.NUM_PARTICIPANTS_TO_EXIT_THRESHOLD, exitThresholdChangedEvent.lessOrEqualThan.toString())
                console.log("Exit Threshold Changed: ", exitThresholdChangedEvent.lessOrEqualThan)
                chrome.runtime.sendMessage(new DomainEventSetBadgeText(getThresholdToExit()?.toString() ?? "N/A"))
            }
            break
    }
});

function getThresholdToExit(): number | undefined {
    const threshold = sessionStorage.getItem(StorageKeys.NUM_PARTICIPANTS_TO_EXIT_THRESHOLD)
    if (threshold != null) {
        return parseInt(threshold)
    } else {
        return undefined
    }
}

function getCurrentNumberOfPeopleWhoParticipated(): number | undefined {
    const numPeopleStr = document.querySelector('#ow3 > div.T4LgNb > div > div:nth-child(11) > div.crqnQb > div.UnvNgf.Sdwpn.P9KVBf > div.jsNRx > div.fXLZ2 > div > div > div:nth-child(2) > div')?.textContent

    if (numPeopleStr != null) {
        return parseInt(numPeopleStr)
    } else {
        return undefined
    }
}

function monitoringNumOfPeopleToExit() {
    const currentNumPeople = getCurrentNumberOfPeopleWhoParticipated()
    const thresholdToExit = getThresholdToExit()

    console.log('탈출 조건을 감시중입니다. ', `${currentNumPeople} <= ${thresholdToExit}`)
    chrome.runtime.sendMessage(new DomainEventSetBadgeText(`${currentNumPeople}<=${thresholdToExit}`))

    if (thresholdToExit && currentNumPeople && currentNumPeople <= thresholdToExit) {

        console.log(`탈출 조건을 만족하여 탈출합니다. N명 이하 탈출 조건: ${thresholdToExit}`)
        chrome.runtime.sendMessage(new DomainEventExitGoogleMeet(window.location.href))
    }
}
