export enum TASK_STATUS {
  NOT_STARTED = 0,
  UNDER_PROGRESS = 1,
  PAUSED = 2,
  FINISHED = 3,
}

export const onStringfyTaskStatus = (status: number): string => {
  switch (status) {
    case 0: {
      return 'Não iniciado';
    }
    case 1: {
      return 'Em andamento';
    }
    case 2: {
      return 'Pausado';
    }
    case 3: {
      return 'Finalizado';
    }
  }
  return '';
};

export const onConvertTaskStatusToNumber = (status: string): number => {
  switch (status.toLowerCase().trim()) {
    case 'não iniciado': {
      return 0;
    }
    case 'em andamento': {
      return 1;
    }
    case 'pausado': {
      return 2;
    }
    case 'finalizado': {
      return 3;
    }
  }
  return 4;
};
