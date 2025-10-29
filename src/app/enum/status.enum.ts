export enum TASK_STRING_STATUS {
  NOT_STARTED = 'Não iniciado',
  UNDER_PROGRESS = 'Em andamento',
  PAUSED = 'Pausado',
  FINISHED = 'Finalizado',
}

export enum TASK_NUMBER_STATUS {
  NOT_STARTED = 1,
  UNDER_PROGRESS = 2,
  PAUSED = 3,
  FINISHED = 4,
}

export const optionTaskStatusList = [
  TASK_STRING_STATUS.UNDER_PROGRESS,
  TASK_STRING_STATUS.PAUSED,
  TASK_STRING_STATUS.FINISHED,
];

export const onTranslateStatusToString = (status: number | null): string => {
  switch (status) {
    case null: {
      return TASK_STRING_STATUS.NOT_STARTED;
    }
    case TASK_NUMBER_STATUS.NOT_STARTED: {
      return TASK_STRING_STATUS.NOT_STARTED;
    }
    case TASK_NUMBER_STATUS.UNDER_PROGRESS: {
      return TASK_STRING_STATUS.UNDER_PROGRESS;
    }
    case TASK_NUMBER_STATUS.PAUSED: {
      return TASK_STRING_STATUS.PAUSED;
    }
    case TASK_NUMBER_STATUS.FINISHED: {
      return TASK_STRING_STATUS.FINISHED;
    }
  }
  return '';
};

export const onTranslateStatusToNumber = (status: string | null): number => {
  switch (status) {
    case null: {
      return TASK_NUMBER_STATUS.NOT_STARTED;
    }
    case TASK_STRING_STATUS.NOT_STARTED: {
      return TASK_NUMBER_STATUS.NOT_STARTED;
    }
    case TASK_STRING_STATUS.UNDER_PROGRESS: {
      return TASK_NUMBER_STATUS.UNDER_PROGRESS;
    }
    case TASK_STRING_STATUS.PAUSED: {
      return TASK_NUMBER_STATUS.PAUSED;
    }
    case TASK_STRING_STATUS.FINISHED: {
      return TASK_NUMBER_STATUS.FINISHED;
    }
  }
  return 4;
};

export type Status = 'Não iniciado' | 'Em andamento' | 'Pausado' | 'Finalizado';

export const onSetIconStatus = (status: Status): string => {
  switch (status) {
    case TASK_STRING_STATUS.NOT_STARTED: {
      return 'stop';
    }
    case TASK_STRING_STATUS.UNDER_PROGRESS: {
      return 'play_circle_filled';
    }
    case TASK_STRING_STATUS.PAUSED: {
      return 'pause_circle_filled';
    }
    case TASK_STRING_STATUS.FINISHED: {
      return 'check_circle';
    }
  }
  return ';';
};

export const onSetIconStatusBackgroundColor = (status: Status): string => {
  switch (status) {
    case TASK_STRING_STATUS.NOT_STARTED: {
      return 'text-gray-400';
    }
    case TASK_STRING_STATUS.UNDER_PROGRESS: {
      return 'text-yellow-400';
    }
    case TASK_STRING_STATUS.PAUSED: {
      return 'text-blue-400';
    }
    case TASK_STRING_STATUS.FINISHED: {
      return 'text-green-400';
    }
  }
  return '';
};
