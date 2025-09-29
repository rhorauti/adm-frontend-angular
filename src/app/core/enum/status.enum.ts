export enum TASK_STRING_STATUS {
  NOT_STARTED = 'Não iniciado',
  UNDER_PROGRESS = 'Em andamento',
  PAUSED = 'Pausado',
  FINISHED = 'Finalizado',
}

export enum TASK_NUMBER_STATUS {
  NOT_STARTED = 0,
  UNDER_PROGRESS = 1,
  PAUSED = 2,
  FINISHED = 3,
}

export const optionTaskStatusList = [
  TASK_STRING_STATUS.NOT_STARTED,
  TASK_STRING_STATUS.UNDER_PROGRESS,
  TASK_STRING_STATUS.PAUSED,
  TASK_STRING_STATUS.FINISHED,
];

export const onStringfyTaskStatus = (status: number | null): string => {
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

export const onConvertTaskStatusToNumber = (status: string | null): number => {
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
