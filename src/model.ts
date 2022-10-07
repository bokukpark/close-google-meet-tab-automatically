export abstract class DomainEvent {

    public type: DomainEventType

    protected constructor(type: DomainEventType) {
        this.type = type;
    }
}

export class DomainEventMonitoringEnabledChanged extends DomainEvent {
    public enabled: boolean

    constructor(enabled: boolean) {
        super(DomainEventType.MONITORING_ENABLED_CHANGED);
        this.enabled = enabled;
    }
}

export class DomainEventExitGoogleMeet extends DomainEvent {
    public tabUrl: string;

    constructor(tabId: string) {
        super(DomainEventType.EXIT_GOOGLE_MEET)
        this.tabUrl = tabId
    }
}

export class DomainEventSetBadgeText extends DomainEvent {
    public text: string

    constructor(text: string) {
        super(DomainEventType.SET_BADGE_TEXT);
        this.text = text
    }
}

export class DomainEventSetBadgeBackgroundColor extends DomainEvent {
    public backgroundColor: string

    constructor(backgroundColor: string) {
        super(DomainEventType.SET_BADGE_BACKGROUND_COLOR);
        this.backgroundColor = backgroundColor
    }
}

export class DomainEventGetExitThreshold extends DomainEvent {

    constructor() {
        super(DomainEventType.GET_EXIT_THRESHOLD);
    }
}

export class DomainEventGetCurrentNumberOfParticipants extends DomainEvent {

    constructor() {
        super(DomainEventType.GET_CURRENT_NUMBER_OF_PARTICIPANTS);
    }
}

export class DomainEventExitThresholdChanged extends DomainEvent {
    public lessOrEqualThan: number;

    constructor(lessOrEqualThan: number) {
        super(DomainEventType.EXIT_THRESHOLD_CHANGED);
        this.lessOrEqualThan = lessOrEqualThan
    }
}

export class DomainEventGetCurrentNumberOfParticipantsChanged extends DomainEvent {
    public numParticipants: number;

    constructor(numParticipants: number) {
        super(DomainEventType.EXIT_THRESHOLD_CHANGED);
        this.numParticipants = numParticipants
    }
}

export enum DomainEventType {
    EXIT_GOOGLE_MEET,
    SET_BADGE_TEXT,
    SET_BADGE_BACKGROUND_COLOR,
    GET_CURRENT_NUMBER_OF_PARTICIPANTS,
    MONITORING_ENABLED_CHANGED,
    EXIT_THRESHOLD_CHANGED,
    NUMBER_OF_PARTICIPANTS_CHANGED,
    GET_EXIT_THRESHOLD,
}

export class StorageKeys {
    static EXIT_GOOGLE_MEET_URL = "targetUrl"
    static NUM_PARTICIPANTS_TO_EXIT_THRESHOLD = "numPeopleToExitThreshold"
}