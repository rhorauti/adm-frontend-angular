export const formatarData = (dataInformada: string) => {
  if (dataInformada != null) {
    return Intl.DateTimeFormat('pt-br').format(new Date(dataInformada));
  } else {
    return '-';
  }
};
