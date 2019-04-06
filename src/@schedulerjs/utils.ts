export enum ResType {
    Project = '_Project',
    Task = '_Task_'
}

export class OverLapJobResError extends Error {
    taskId: string;
    constructor(newTaskId: string, message: string) {
        super(message);
        this.name = 'JobReservationError';
        this.taskId = newTaskId;
    }
}

export class NoAvailableTimeError extends Error {
    taskId: string;
    constructor(newTaskId: string, message: string) {
        super(message);
        this.name = 'JobReservationError';
        this.taskId = newTaskId;
    }
}
