import {
    DomainEventSetBadgeText,
    DomainEventExitGoogleMeet,
    DomainEventType,
    DomainEventSetBadgeBackgroundColor, StorageKeys
} from "./model";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background - Received a event: ', request.type)

    switch (request.type) {
        case DomainEventType.EXIT_GOOGLE_MEET:
            console.log('Background::EXIT_GOOGLE_MEET: ', request)
            const tabCloseEvent = request as DomainEventExitGoogleMeet
            console.log('TAB CLOSE EVENT CAPTURED!')
            chrome.tabs.query({url: tabCloseEvent.tabUrl}, (tabs) => {
                chrome.tabs.remove(tabs[0].id!)
            })
            chrome.action.setBadgeText({text: ':_)'})
            chrome.action.setBadgeBackgroundColor({color: 'orange'})
            break

        case DomainEventType.SET_BADGE_TEXT:
            console.log('Background::SET_BADGE_TEXT', request)
            const setBadgeTextEvent = request as DomainEventSetBadgeText
            chrome.action.setBadgeText({text: setBadgeTextEvent.text})
            break

        case DomainEventType.SET_BADGE_BACKGROUND_COLOR:
            console.log('Background::SET_BADGE_BACKGROUND_COLOR', request)
            const setBadgeBackgroundColorEvent = request as DomainEventSetBadgeBackgroundColor
            chrome.action.setBadgeBackgroundColor({color: setBadgeBackgroundColorEvent.backgroundColor})
            break
    }
})
