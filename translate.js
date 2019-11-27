var currLang = "en";
var callBack;


function getTransArr()
{
  var arr = [];


  /* all */
  arr["transLog"] =     {en :  "Log Messages", ru : "Лог"};
  arr["transMenMain"] = {en :  "MAIN", ru : "Основные страницы"};
  arr["transDash"] =    {en :  "Dashboard", ru : "Мониторинг"};
  arr["transDev"] =     {en :  "Devices", ru : "Устройства"};
  arr["tranConf"] =     {en :  "Config", ru : "Параметры"};
  arr["transSet"] =     {en :  "Settings", ru : "Настройки"};

  /* index */
  arr["transAutoUpdate"] =     {en :  "Auto update", ru : "Обновлять"};
  arr["transElOver"] =  {en :  "Element Overview", ru : "Обзор Element"};
  arr["transThName"] =  {en :  "Name", ru : "Имя"};
  arr["transThState"] = {en :  "State", ru : "Состояние"};
  arr["transThTemp"] =  {en :  "Temperature", ru : "Температуры"};
  arr["transThFan"] =   {en :  "Fans", ru : "Кулеры"};
  arr["transThInj"] =   {en :  "Injectors", ru : "Инжекторы"};
  arr["transThPow"] =   {en :  "Intput Pow", ru : "Входная мощность"};
  arr["transThVer"] =   {en :  "Version", ru : "Версия"};
  arr["transThOthStat"] =   {en :  "Other Status", ru : "Общее состояние"};

  /* devs  */
  arr["transShow"] =     {en :  "Show:", ru : "Отображать:"};
  arr["transUpd"] =     {en :  "Auto update", ru : "Обновлять"};
  arr["transZabStat"] = {en :  "Zabbix status:", ru : "Состояние:"};
  arr["transChFan"] =    {en :  "Fans", ru : "Кулеры"};
  arr["transChInj"] =    {en :  "Injectors", ru : "Инжекторы"};
  arr["transChPS"] =     {en :  "PS", ru : "БП"};
  arr["transChDevs"] =    {en :  "PCI Devices", ru : "PCI устройства"};
  arr["transChSS"] =     {en :  "System Status", ru : "Состояние системы"};

  arr["trWarn"] = {en :  "Warning : There is no information available, the last one is displayed.", ru : "Предупреждение: нет доступной информации, отображается последняя."};


  /* conf */
  arr["trZAL"] =      {en :  "Zabbix API Login", ru : "Вход в Zabbix API"};
  arr["trUN"] =       {en :  "User Name", ru : "Имя пользователя"};
  arr["trPass"] =     {en :  "Password", ru : "Пароль"};
  arr["trStat"] =     {en :  "Status:", ru : "Статус:"};
  arr["trHost"] =     {en :  "Host", ru : "Хост"};
  arr["testUser"] =   {en :  "Test User", ru : "Проверить"};
  arr["saveUser"] =     {en :  "Save", ru : "Сохранить"};




  return arr;
}

/*
  ru
  en
*/
function translatePage(lang)
{

  trans = getTransArr();

  for(key in trans)
  {
    item = trans[key];
    var word;

    if(lang == "ru")
    {
      word = item.ru;
    }
    else if (lang == "en")
    {
        word = item.en;
    }

    $('#' + key).html(word);
  }

  if(callBack)
  {
    callBack();
  }
}


function setCallBack(_back)
{
  callBack = _back;
}

function initTrans()
{
  $("#enLocale").on("click", setLangEn);
  $("#ruLocale").on("click", setLangRu);
}

function setLangRu()
{
  currLang = "ru";
  translatePage("ru");
}

function setLangEn()
{
  currLang = "en";
  translatePage("en");
}
