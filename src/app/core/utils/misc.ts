function safeEncryptU(str: string): string {
  try {
    // Converter caracteres especiais para formato seguro
    const safeStr = encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      function toSolidBytes(_, p1) {
        return String.fromCharCode(Number('0x' + p1));
      }
    );
    return btoa(safeStr);
  } catch (e) {
    console.log('safeEncryptU error' + e);
    return str;
  }
}

function safeDecryptU(str: string): string {
  try {
    // Reverter a conversão
    return decodeURIComponent(
      atob(str)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch (e) {
    console.log('safeDecryptU error' + e);
    return str;
  }
}

export function saveStorage(storage: string, info: any) {
  localStorage.setItem(storage, safeEncryptU(JSON.stringify(info)));
}
export function loadStorage(storage: string, remove = false) {
  const info = localStorage.getItem(storage);
  if (remove) localStorage.removeItem(storage);
  try {
    return info && info.length > 0 ? JSON.parse(safeDecryptU(info)) : null;
  } catch {
    localStorage.removeItem(storage);
    return null;
  }
}
export function removeStorage(storage: string) {
  localStorage.removeItem(storage);
}

/** Verifica se o CPF é válido */
export function isCPFValid(cpf: string) {
  if (cpf == null) return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf == '') return false;
  if (
    cpf.length != 11 ||
    cpf == '00000000000' ||
    cpf == '11111111111' ||
    cpf == '22222222222' ||
    cpf == '33333333333' ||
    cpf == '44444444444' ||
    cpf == '55555555555' ||
    cpf == '66666666666' ||
    cpf == '77777777777' ||
    cpf == '88888888888' ||
    cpf == '99999999999'
  )
    return false;
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(9))) return false;
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(10))) return false;
  return true;
}

/**
 * isNomeValid
 * Verifica se o nome completo cadastrado nos Meus Dados é válido
 * @param nome nome digitado pelo usuário
 * @returns retorna true caso os nome digitado atenda as seguintes condições abaixo:
 * - 2 ou mais caracteres em cada bloco(nome/nome do meio/sobrenome)
 * - 1 espaço em branco em cada bloco
 */
export function isNomeValid(nome: string) {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ']{2,}(\s[A-Za-zÀ-ÖØ-öø-ÿ']{1,}){0,10}$/g.test(nome);
}

/**
 * Verifica se o telefone é válido
 * @param value
 */
export function isTelephoneNumberValid(telefone: string) {
  return /\(\d{2}\)\s{1}\d{4,5}-\d{4}/.test(telefone);
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

export function isNullOrWhitespace(info: string | null) {
  return info == null || info.trim().length == 0;
}

export function formatCpfOrCnpj(value: string): string {
  if (!value) return '';
  if (value.length === 11) return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  if (value.length === 14)
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  return '';
}

export function formatTelephoneNumber(number: string): string {
  const telNumber = number.replace(/\D/g, '');
  if (!telNumber) return '';

  if (telNumber.length <= 2) {
    return `(${telNumber}`;
  } else if (telNumber.length <= 6) {
    return `(${telNumber.substring(0, 2)}) ${telNumber.substring(2)}`;
  } else if (telNumber.length <= 10) {
    return `(${telNumber.substring(0, 2)}) ${telNumber.substring(2, 6)}-${telNumber.substring(6)}`;
  } else {
    return `(${telNumber.substring(0, 2)}) ${telNumber.substring(2, 7)}-${telNumber.substring(7)}`;
  }
}

export const translateDeptName = (deptName: string): string => {
  switch (deptName.toLowerCase().trim()) {
    case 'maintenance': {
      return 'Manutenção';
    }
    case 'purchasing': {
      return 'Compras';
    }
    case 'pc': {
      return 'PCP';
    }
    case 'sales': {
      return 'Vendas';
    }
    case 'project': {
      return 'Projetos';
    }
    case 'finance': {
      return 'Financeiro';
    }
    case 'quality': {
      return 'Qualidade';
    }
    case 'hr': {
      return 'RH';
    }
  }
  return '';
};

export const setDeptNameTranslationToDefaultName = (deptName: string): string => {
  switch (deptName.toLowerCase().trim()) {
    case 'manutenção': {
      return 'maintenance';
    }
    case 'compras': {
      return 'purchasing';
    }
    case 'pcp': {
      return 'pc';
    }
    case 'vendas': {
      return 'sales';
    }
    case 'projetos': {
      return 'project';
    }
    case 'financeiro': {
      return 'finance';
    }
    case 'qualidade': {
      return 'quality';
    }
    case 'rh': {
      return 'hr';
    }
  }
  return '';
};
