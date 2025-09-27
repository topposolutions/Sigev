import moment from "moment";
import config from "./config";
import { isEmpty } from "ramda";
/**
 * Return a formatted date
 * @param date Valid date number format
 * @return {string}
 */
const getDateFormatted = function (date) {
  if (date && date.length == 10) date = date + " 00:00";
  return !date ? "-" : moment(date).format(config.FORMAT_REPORT_DATE);
};

/**
 * Return a formatted date with hours
 * @param date Valid date number format
 * @return {string}
 */
const getDateFormattedWithSeconds = function (date) {
  if (date && date.length == 10) date = date + " 00:00";
  return !date ? "-" : moment(date).format(config.FORMAT_REPORT_DATE_SEC);
};

/**
 * Return a formatted date
 * @param date Valid date number format
 * @return {string}
 */
const getDateFormattedWHour = function (date) {
  if (date && date.length == 10) date = date + " 00:00";
  return !date
    ? "-"
    : moment(date).format(config.FORMAT_REPORT_DATE_WITHOUT_HOUR);
};

/**
 * Transform a boolean type to "Sim" if true and "Não" if false
 * TODO: Get the default user language and translate
 * @param value
 * @return {string}
 */
const formatBollean = (value) => (value ? "Sim" : "Não");

/**
 * Return a 'en' formatted date
 * @param date Valid date number format
 * @return {string}
 */
const getEnDateFormatted = function (date) {
  if (date && date.length == 10) date = date + " 00:00";
  return !date ? "-" : moment(date).format(config.FORMAT_REPORT_DATE_EN);
};

/**
 * Return a 'en' formatted date
 * @param date Valid date number format
 * @return {string}
 */
const getEnHourDateFormatted = function (date) {
  if (date && date.length == 10) date = date + " 00:00";
  return !date ? "-" : moment(date).format(config.FORMAT_REPORT_DATE_EN_HOURS);
};

const getHoursFromDate = function (date) {
  if (date && date.length == 10) date = date + " 00:00";
  return !date ? "-" : moment(date).format(config.FORMAT_REPORT_HOURS);
};

const getHoursFromDateAgendamentos = function (date, paCutOffHour) {
  if (date && date.length == 10) date = date + " 00:00";

  var m = moment(date);
  var roundUp =
    m.minute() || m.second() || m.millisecond()
      ? m.add(1, "hour").startOf("hour").add(paCutOffHour, "minutes")
      : m.startOf("hour");

  return !roundUp ? "-" : moment(roundUp).format(config.FORMAT_REPORT_HOURS);
};

const getActualDate = (format) => {
  if (!format) format = "DD/MM/YYYY";
  return new moment().format(format);
};

const getNowDateTime = () => {
  return new moment().format();
};

const getIsoDateByString = (dataString) => {
  const [day, month, year, hours, minutes] = dataString.match(/\d+/g);
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
};

const getFutureDate = (days, format, data) => {
  if (!data) data = new Date();
  return moment(data).add(days, "days").format(format);
};

const isAfterDate = function (date1, date2) {
  return moment(date1).isAfter(date2);
};

const getFirstDayOfMonth = (month) => {
  var now = moment();
  now.date(1);
  now = now.subtract(month, "month");
  return moment(now).format(config.FORMAT_REPORT_DATE_EN);
};

const getIsoDate = (date) => {
  return moment(date).format("yyyy-MM-DDTHH:mm:ss") + "Z";
};

const newDate = (date) => {
  if (date && date.length == 10) date = date + " 00:00";
  return !date ? null : moment(date);
};

const getTime = (date) => (!date ? null : newDate(date).valueOf());
const getDate = (date) => (!date ? null : newDate(date).day());
const getMonth = (date) => (!date ? null : newDate(date).month() + 1);
const getYear = (date) => (!date ? null : newDate(date).year());

const getCurrentMonth = () => {
  return moment().month() + 1;
};

const getCurrentYear = () => {
  return moment().year();
};

const getDateSubtractingDays = (days) => {
  var now = moment();
  now = now.subtract(days, "days");
  return moment(now).format(config.FORMAT_REPORT_DATE_EN);
};

const validarPlaca = (placa) => {
  let padraoBrasil = "[A-Z]{3}[0-9]{4}"; //AAA1234
  let padraoBrasil2 = "[A-Z]{3}[0-9][A-Z][0-9]{2}"; //AAA9A12
  let padraoParaguai = "[A-Z]{3}[0-9]{3}"; //AAA123
  let padraoParaguai2 = "[A-Z]{4}[0-9]{3}"; //AAAA123
  let padraoArgentina = "[A-Z]{2}[0-9]{3}[A-Z]{2}"; //AA123AA
  let regex = new RegExp(
    `${padraoBrasil}|${padraoBrasil2}|${padraoParaguai}|${padraoParaguai2}|${padraoArgentina}`
  );

  return regex.test(placa);
};

const validarCpfCnpj = (cpfCnpj) => {
  cpfCnpj = cpfCnpj?.toString()?.length > 5 ? removerMascara(cpfCnpj) : "";
  return cpfCnpj.length == 11 ? validarCPF(cpfCnpj) : validarCNPJ(cpfCnpj);
};

const validarSiglaArmador = (sigla) => {
  const re = /[A-Z]/g;
  return re.test(String(sigla));
};

const validarEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validarCPF = (cpf) => {
  cpf = removerMascara(cpf);
  if (cpf == "") return false;
  // Elimina CPFs invalidos conhecidos
  if (
    cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999"
  )
    return false;
  // Valida 1o digito
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(9))) return false;
  // Valida 2o digito
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11) rev = 0;
  if (rev != parseInt(cpf.charAt(10))) return false;
  return true;
};

const validarCNPJ = (cnpj) => {
  cnpj = cnpj.toString().length > 6 ? removerMascara(cnpj) : "";

  if (cnpj == "") return false;

  if (cnpj.length != 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj == "00000000000000" ||
    cnpj == "11111111111111" ||
    cnpj == "22222222222222" ||
    cnpj == "33333333333333" ||
    cnpj == "44444444444444" ||
    cnpj == "55555555555555" ||
    cnpj == "66666666666666" ||
    cnpj == "77777777777777" ||
    cnpj == "88888888888888" ||
    cnpj == "99999999999999"
  )
    return false;

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
};

const removerMascara = (str) => {
  if (!str || str == null || str == undefined || str == "") return "";
  return str?.replace(/[^\d]+/g, "");
};

const removerMascaraDinheiro = (value) => {
  var clean = parseFloat(
    value?.replace(/[^0-9,]*/g, "")?.replace(",", ".")
  ).toFixed(2);
  return clean;
};

const currentDate = function () {
  return moment().format("YYYY-MM-DD");
};

const estaEntreOPeriodo = (dataIncio, dataFim, dataValidar) => {
  const inicio = moment(dataIncio);
  const fim = moment(dataFim);
  const dataSelecionada = moment(dataValidar);
  return dataSelecionada >= inicio && dataSelecionada <= fim;
};

const tomorowDate = function () {
  return moment().add(1, "days").format("YYYY-MM-DD");
};

const formatDate = function (date, format, noHour) {
  if (date && date.length == 10 && !noHour) date = date + " 00:00";
  return !date ? "-" : moment(new Date(date)).format(format);
};

const formatDatetimeReplace = function (date) {
  return !date ? "-" : date?.replace("-", "/")?.replace("-", "/");
};

const formatDateToISO = function (date, format = "YYYY-MM-DD HH:mm:ss") {
  date = moment(date, format);
  let d = moment(date);
  return d.format("YYYY-MM-DD[T]HH:mm:ss");
};

const formatDateBRToISO = function (date, format = "DD-MM-YYYY HH:mm:ss") {
  date = moment(date, format);
  let d = moment(date);
  return d.format("YYYY-MM-DD[T]HH:mm:ss");
};

const formatDateISOToBR = function (date, format = "YYYY-MM-DD[T]HH:mm:ss") {
  date = moment(date, format);
  let d = moment(date);
  return d.format("DD-MM-YYYY HH:mm:ss");
};

const formatDateSpecific = function (
  date,
  formatter = "YYYY-MM-DD",
  format = "DD/MM/YYYY "
) {
  return moment(date, formatter).format(format);
};

const momentDate = function (date) {
  return moment(date);
};

const pegaDataAtualFormatada = function () {
  return moment().format(moment.HTML5_FMT.DATE);
};

const getStartOfMonth = function () {
  return moment().startOf("month").format("YYYY-MM-DD");
};

const formatDateRfb = function (date, hours = false) {
  if (!date) return;
  date = date.split(" ");
  date[0] = date[0].split("-").reverse().join("-");
  if (hours) return date[0] + " " + date[1];
  return date[0];
};

const formatarDataRfbPt = function (date, hours = false) {
  if (!date) return;
  date = date.split(" ");
  date[0] = date[0]?.replaceAll("-", "/");
  if (hours) return date[0] + " " + date[1];
  return date[0];
};

const selecionouAlgumParametro = function (parametros) {
  let parametrosFiltro = parametros.filter((parametro) => {
    return !isEmpty(parametro);
  });
  return parametrosFiltro.length > 0 ? true : false;
};
 

const liberarAgendamentoNovo = (data) => {
  let dataLimite = formatDate("2023-06-21");
  const dataHoje = currentDate();

  if (data) {
    dataLimite = new Date(data) > new Date(dataLimite) ? data : dataLimite;
  }

  return {
    liberado: dataHoje > dataLimite,
    dataLimite,
    dataHoje,
  };
};

const stripTags = function (html) {
  var tmp = document.implementation.createHTMLDocument("New").body;
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const removerCaractere = function (str) {
  if (!str) return;
  return str?.replace(/[^a-z0-9\s]/gi, "")?.replace(/[_\s]/g, "-");
};

const verificarDataMaiorQueAtual = function (data) {
  let data_atual = moment();
  data = moment(data);

  if (data_atual.isAfter(data)) {
    return true;
  }
  return false;
};

const getHoraInicialJanelaAgendamento = function (janela) {
  if (!janela) return;
  var retorno = janela.split("-");
  return retorno[0];
};

const forcaSenha = function (senha) {
  if (!senha) return false;
  if (senha.length < 8) return false;
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(senha);
};

const arrayToUrl = function (object, param) {
  if (object.length == 0) return;
  var queryString = Object.keys(object)
    .map((key) => param + "=" + object[key])
    .join("&");
  return queryString;
};

const objectToUrl = function (obj) {
  var p = [];
  for (var key in obj) {
    if (obj[key]) {
      p.push(key + "=" + encodeURIComponent(obj[key]));
    }
  }
  return p.join("&");
};

const orderArrayObjectByField = function (field) {
  var sortOrder = 1;
  if (field[0] === "-") {
    sortOrder = -1;
    field = field.substr(1);
  }
  return function (a, b) {
    var result = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
    return result * sortOrder;
  };
};

const diffHoursMinutes = function (endDate) {
  var timeStart = moment(endDate).valueOf();
  var timeEnd = moment().valueOf();
  var hourDiff = timeEnd - timeStart; //in ms
  var minDiff = hourDiff / 60 / 1000; //in minutes
  var hDiff = hourDiff / 3600 / 1000; //in hours
  var humanReadable = {};
  humanReadable.hours = Math.floor(hDiff);
  humanReadable.minutes = Math.round(minDiff - 60 * humanReadable.hours);
  return humanReadable; //{hours: 0, minutes: 30}
};

const diffDays = function (date1, date2) {
  const a = moment(date1);
  const b = moment(date2);
  return a.diff(b, "days");
};

const isTodayOrBefore = function (date) {
  if (!date) return false;
  return !moment(date).isAfter(moment(), "day");
};

const pluck = function (arr, field) {
  const pluck = (key) => (array) =>
    Array.from(new Set(array.map((obj) => obj[key])));

  const plucked = pluck(field);

  return plucked(arr);
};

// Search item in array object by field like
const searchArrayObjLike = function (objList, text) {
  if (undefined === text || text === "") return objList;
  return objList.filter((item) => {
    let flag;
    for (let prop in item) {
      flag = false;
      flag =
        item[prop].toString().toLowerCase().indexOf(text.toLowerCase()) > -1;
      if (flag) break;
    }
    return flag;
  });
};

// Search item in array object by field
function searchArrayObj(objList, text) {
  var result = objList.filter(function (o) {
    return o.value.toLowerCase() == text.toLowerCase();
  });
  return result ? result : null; // or undefined
}

//Remove array object duplicated (by key)
const removeDuplicatesArrayObjects = (array, key) => {
  return array.reduce((arr, item) => {
    const removed = arr.filter((i) => i[key] !== item[key]);
    return [...removed, item];
  }, []);
};

const getDayOfTheWeek = (date = moment()) => {
  var now = moment(date);
  return now.day();
};

const strLimit = (value, size) => {
  if (!value) return "";
  value = value.toString();

  if (value.length <= size) {
    return value;
  }
  return value.substr(0, size) + "...";
};

const verificaCancelamento = (dataProgramacao) => {
  const dataAtual = moment();
  const horaAtualSuperiorA17 = moment(
    `${dataAtual.format("YYYY-MM-DD")} 17:00`
  ).isBefore(dataAtual);
  if (dataAtual.isSameOrAfter(moment(dataProgramacao), "day")) return false;

  let dataAmanha = moment().add(1, "day");

  if (dataAmanha.isoWeekday() === 6) dataAmanha = dataAmanha.add(2, "day");
  if (dataAmanha.isoWeekday() === 7) dataAmanha = dataAmanha.add(1, "day");

  const dataInformadaEhProximoDiaUtil =
    dataAmanha.isSame(moment(dataProgramacao), "day") ||
    dataAtual.isSame(moment(dataProgramacao), "day");
  if (horaAtualSuperiorA17 && dataInformadaEhProximoDiaUtil) return false;
  else return true;
};

const adicionarMascaraCNPJ = (value) => {
  if (!value) return "";
  return value?.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
};

const adicionarMascaraCPF = (value) => {
  value = value?.replace(/\D/g, "");
  value = value?.replace(/(\d{3})(\d)/, "$1.$2");
  value = value?.replace(/(\d{3})(\d)/, "$1.$2");

  value = value?.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
};

const formatResponseError = (that, err) => {
  return err.response && err.response.data
    ? err.response.data.message.join(" ")
    : that.$t("PAGES_ERRORS.COMMON.CORS");
};

const verifyDeadLock = (err) => {
  try {
    if(err && err.response && err.response.data &&  err.response.data.message && 
      err.response.data.message.some(el => el.includes("Lock"))) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p) && obj[p] !== null && obj[p] !== "") {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

const buildMessageError = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.messagei18n ||
    error.response?.data?.errorMessage ||
    error.response?.data?.enTag ||
    "COMMONS.ERROR_MESSAGE"
  );
};

const hasMessageError = (error) => {
  return (
    error.response?.data?.enTag ||
    error.response?.data?.messagei18n ||
    error.response?.data?.message
  );
};

const formatarReal = (value) => {
  if (value)
    return value.toLocaleString("pt-br", {
      minimumFractionDigits: 2,
    });
};

const formatarDolar = (value) => {
  if (value)
    return value.toLocaleString("en-us", {
      minimumFractionDigits: 2,
    });
};

const validarDat = (dat) => {
  let padrao = "[0-9]{2}[A-Z]{2}[0-9]{7}"; //32TR3576446
  let regex = new RegExp(`${padrao}`);

  return regex.test(dat);
};

const getQuery = (obj) => {
  return Object.keys(obj)
    .map((key) => {
      if (obj[key].constructor === Object) {
        if (obj[key].start && obj[key].end) {
          return key + "@<>" + obj[key].start + "," + obj[key].end;
        } else if (obj[key].start && !obj[key].end) {
          return key + "@<>" + obj[key].start;
        } else if (!obj[key].start && obj[key].end) {
          return key + "@<>" + obj[key].end;
        } else {
          return "";
        }
      } else if (obj[key].constructor === Array) {
        if (obj[key].length <= 0) {
          return "";
        } else
          return (
            "( " +
            obj[key]
              .map((array) => {
                return key + ":" + array;
              })
              .join(" or ") +
            " )"
          );
      } else if (obj[key]) {
        return key + ":" + obj[key];
      }
    })
    .filter((i) => i)
    .join(" and ");
};

const uniqBy = (arr, predicate) => {
  const cb = typeof predicate === "function" ? predicate : (o) => o[predicate];

  return [
    ...arr
      .reduce((map, item) => {
        const key = item === null || item === undefined ? item : cb(item);

        map.has(key) || map.set(key, item);

        return map;
      }, new Map())
      .values(),
  ];
};

const getSubmenus = (menuItems) => {
  let submenus = [];
  menuItems.forEach((menu) => {
    if (menu.submenu) {
      menu.submenu.forEach((i) => {
        submenus.push(i);
      });
    }
  });
  return submenus;
};

// prettier-ignore
const formatResponseApi = (data) => {
  let pagination = {
    length: parseInt(data.headers["total-of-elements"]),
  };

  return { data: data.data, pagination: pagination };
};

const formatDateHour = (value) => {
  return moment(value, "YYYY-MM-DD HH:mm").format("DD/MM/YYYY - HH:mm");
};

const formatDateISO = function (date, format = "YYYY-MM-DD HH:mm") {
  date = moment(date, format);
  let d = moment(date);
  return d.format("YYYY-MM-DD[T]HH:mm");
};

function formatMoneyBR(valor) {
  let value = `R$ ${valor}`;
  return value;
}

 

 
export default {
  removerMascara,
  removerMascaraDinheiro,
  validarCPF,
  validarPlaca,
  formatDate,
  formatDatetimeReplace,
  formatDateToISO,
  formatDateBRToISO,
  formatDateISOToBR,
  formatDateRfb,
  formatDateSpecific,
  formatarDataRfbPt,
  getDateFormatted, // Return a formatted date
  getDateFormattedWHour, // Return a formatted date
  pegaDataAtualFormatada, // return a formatted date without need a date
  getStartOfMonth,
  formatBollean,
  getFirstDayOfMonth,

  getTime,
  getDate,
  getMonth,
  getYear,
  currentDate,
  tomorowDate,
  getCurrentMonth,
  getCurrentYear,

  getDateFormattedWithSeconds,
  getDateSubtractingDays,
  getEnDateFormatted, // Return a en formatted date
  getActualDate,
  getNowDateTime,
  getFutureDate, // Return a future formatted date
  isAfterDate,
  getEnHourDateFormatted, // Return a en formatted date with hours
  getHoursFromDate,
  getHoursFromDateAgendamentos,
  getIsoDate,
  momentDate,
  liberarAgendamentoNovo,
  validarCNPJ,
  validarCpfCnpj,
  validarEmail,
  validarDat,
  validarSiglaArmador,

  stripTags,
  removerCaractere,
  verificarDataMaiorQueAtual,
  getHoraInicialJanelaAgendamento,
  forcaSenha,
  arrayToUrl,
  objectToUrl,
  orderArrayObjectByField,
  diffHoursMinutes,
  diffDays,
  isTodayOrBefore,
  pluck,
  searchArrayObjLike,
  estaEntreOPeriodo,
  searchArrayObj,
  removeDuplicatesArrayObjects,
  getDayOfTheWeek,
  strLimit,
  adicionarMascaraCNPJ,
  verificaCancelamento,
  adicionarMascaraCPF,
  formatResponseError,
  verifyDeadLock,
  serialize,
  buildMessageError,
  hasMessageError,
  formatarReal,
  formatarDolar,
  uniqBy,
  getQuery,
  getIsoDateByString,
  getSubmenus,
  selecionouAlgumParametro,
  formatResponseApi,
  formatDateHour,
  formatDateISO,
  formatMoneyBR,
};
