export enum ChatTargetType {
    SELF = 1,
    OTHER = 2,
    TIME = 3,
}

export interface ChatData {
    type: ChatTargetType
    text: string
}