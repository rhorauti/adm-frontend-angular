export enum DEPT_NAMES_LOCAL_LANGUAGE {
  MANUTENCAO = 'Manutenção',
  COMPRAS = 'Compras',
  PCP = 'PCP',
  VENDAS = 'Vendas',
  PROJETOS = 'Projetos',
  FINANCEIRO = 'Financeiro',
  QUALIDADE = 'Qualidade',
  RH = 'RH',
  ENGENHARIA = 'Engenharia',
  PRODUCAO = 'Produção',
}

export enum DEPT_NAMES_ENGLISH {
  MAINTENANCE = 'maintenance',
  PURCHASING = 'purchasing',
  PC = 'pc',
  SALES = 'sales',
  PROJECT = 'project',
  FINANCE = 'finance',
  QUALITY = 'quality',
  HR = 'hr',
  ENGINEERING = 'engineering',
  PRODUCTION = 'production',
}

export const translateDeptNameToLocalLanguage = (
  deptName: DEPT_NAMES_ENGLISH
): DEPT_NAMES_LOCAL_LANGUAGE => {
  switch (deptName.trim()) {
    case DEPT_NAMES_ENGLISH.MAINTENANCE:
      return DEPT_NAMES_LOCAL_LANGUAGE.MANUTENCAO;
    case DEPT_NAMES_ENGLISH.PURCHASING:
      return DEPT_NAMES_LOCAL_LANGUAGE.COMPRAS;
    case DEPT_NAMES_ENGLISH.PC:
      return DEPT_NAMES_LOCAL_LANGUAGE.PCP;
    case DEPT_NAMES_ENGLISH.SALES:
      return DEPT_NAMES_LOCAL_LANGUAGE.VENDAS;
    case DEPT_NAMES_ENGLISH.PROJECT:
      return DEPT_NAMES_LOCAL_LANGUAGE.PROJETOS;
    case DEPT_NAMES_ENGLISH.FINANCE:
      return DEPT_NAMES_LOCAL_LANGUAGE.FINANCEIRO;
    case DEPT_NAMES_ENGLISH.QUALITY:
      return DEPT_NAMES_LOCAL_LANGUAGE.QUALIDADE;
    case DEPT_NAMES_ENGLISH.HR:
      return DEPT_NAMES_LOCAL_LANGUAGE.RH;
    case DEPT_NAMES_ENGLISH.ENGINEERING:
      return DEPT_NAMES_LOCAL_LANGUAGE.ENGENHARIA;
    case DEPT_NAMES_ENGLISH.PRODUCTION:
      return DEPT_NAMES_LOCAL_LANGUAGE.PRODUCAO;
    default:
      return DEPT_NAMES_LOCAL_LANGUAGE.MANUTENCAO;
  }
};

export const translateDeptNameToEnglish = (
  deptName: DEPT_NAMES_LOCAL_LANGUAGE
): DEPT_NAMES_ENGLISH => {
  const name = deptName.trim().toLowerCase();
  switch (name) {
    case DEPT_NAMES_LOCAL_LANGUAGE.MANUTENCAO.toLowerCase():
      return DEPT_NAMES_ENGLISH.MAINTENANCE;
    case DEPT_NAMES_LOCAL_LANGUAGE.COMPRAS.toLowerCase():
      return DEPT_NAMES_ENGLISH.PURCHASING;
    case DEPT_NAMES_LOCAL_LANGUAGE.PCP.toLowerCase():
      return DEPT_NAMES_ENGLISH.PC;
    case DEPT_NAMES_LOCAL_LANGUAGE.VENDAS.toLowerCase():
      return DEPT_NAMES_ENGLISH.SALES;
    case DEPT_NAMES_LOCAL_LANGUAGE.PROJETOS.toLowerCase():
      return DEPT_NAMES_ENGLISH.PROJECT;
    case DEPT_NAMES_LOCAL_LANGUAGE.FINANCEIRO.toLowerCase():
      return DEPT_NAMES_ENGLISH.FINANCE;
    case DEPT_NAMES_LOCAL_LANGUAGE.QUALIDADE.toLowerCase():
      return DEPT_NAMES_ENGLISH.QUALITY;
    case DEPT_NAMES_LOCAL_LANGUAGE.RH.toLowerCase():
      return DEPT_NAMES_ENGLISH.HR;
    case DEPT_NAMES_LOCAL_LANGUAGE.ENGENHARIA.toLowerCase():
      return DEPT_NAMES_ENGLISH.ENGINEERING;
    case DEPT_NAMES_LOCAL_LANGUAGE.PRODUCAO.toLowerCase():
      return DEPT_NAMES_ENGLISH.PRODUCTION;
    default:
      return DEPT_NAMES_ENGLISH.MAINTENANCE;
  }
};
