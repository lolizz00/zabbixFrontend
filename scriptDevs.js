var TEMPL_NAME = 'SWB_TEMPL';
var UPD_INTERVAL = 3000;
var swbN;

var SystemState = "";

var timeoutIdUpdate;
var currList = [];

function stringIntToShortString(val)
{
  val = parseFloat(val, 10);
  val = val.toString();
  return val;
}

/* ------  */



function updateSystemState()
{
  getHostIdByName(swbN).then(id => {
    getItemByHostName(id, "System State").then(res =>
    {
        SystemState = res.value;
    })
  });

}

function updateZabStat()
{
   getHostStatename(swbN).then(state => {
     if(state != "OK")
     {
       $("#warn").css("display", "");
       state = "<label class='badge badge-danger'>" + state +  "</label>";
     }
     else
     {
      $("#warn").css("display", "none");
      state =  "<label class='badge badge-primary'>" + state +  "</label>";
     }

     $("#swbStat").html(state);

   });
}

/* --- Fans ---*/
function FansBoxShow(state)
{
  if(!state)
  {
     $("#FansBoxWid").css("display", "none");
  }
  else
  {
      $("#FansBoxWid").css("display", "");
  }

}

function FansBoxUpdate()
{


  getHostIdByName(swbN).then(id => {
    arr = ["FAN #1 PWM", "FAN #2 PWM", "FAN #3 PWM", "FAN #4 PWM", "FAN #1 RPM", "FAN #2 RPM", "FAN #3 RPM", "FAN #4 RPM", "System State"];

    getItemsHost(id, arr).then(data => {

      var newdata = [];


      for(var  i =1; i <= 4;i++)
      {
        if( (data["System State"] == "OFF") || (data["System State"] == ""))
        {
          newdata.push(["#" + i, "-" , "-"]);
        }
        else
        {
          var rpm = data["FAN #" + i + " RPM"];

          if(rpm < 1000)
          {
            rpm = "<label class='badge badge-danger'>0</label>";
          }

          newdata.push(["#" + i, data["FAN #" + i + " PWM"], rpm]);
        }
      }

      $("#FansBoxWid").html("");

      if(currLang == "ru")
      {
        var html = renderTableHTML("Кулеры", "FansBoxWid", [" ", "ШИМ", "об/мин"], newdata);
      }
      else
      {
        var html = renderTableHTML("Fans", "FansBoxWid", [" ", "PWM", "RPM"], newdata);
      }

      $("#FansBoxWid").html(html);


    })
  });

}

/* --- Inj ---*/
function InjectorsBoxShow(state)
{
  if(!state)
  {
     $("#InjectorsBoxWid").css("display", "none");
  }
  else
  {
      $("#InjectorsBoxWid").css("display", "");
  }

}

function InjectorsBoxUpdate()
{

  getHostIdByName(swbN).then(id => {
    arr = ["Injector #1 Status", "Injector #1 Available","Injector #2 Status", "Injector #2 Available", "Injector #3 Status", "Injector #3 Available", "Injector #4 Status", "Injector #4 Available", "System State"];

    getItemsHost(id, arr).then(data => {

      var newdata = [];

      for(var  i =1; i <= 4;i++)
      {
        if((data["System State"] != "OFF") && (data["System State"] != ""))
        {
          stat = data["Injector #" + i + " Status"];
          if(stat == "ERR")
          {
            if(currLang == "en")
            {
              stat = "<label class='badge badge-danger'>ERR</label>";
            }
            else
            {
              stat = "<label class='badge badge-danger'>Ошибка</label>";
            }
          }
          newdata.push(["#" + i, data["Injector #" + i + " Available"], stat]);
        }
        else
        {
          newdata.push(["#" + i, "-" , "-"]);
        }
      }

      $("#InjectorsBoxWid").html("");
      if(currLang == "en")
      {
        var html = renderTableHTML("Injectors", "InjectorsBoxWid", [" ", "Available", "Status"], newdata);
      }
      else
      {
        var html = renderTableHTML("Инжекторы", "InjectorsBoxWid", [" ", "Доступность", "Состояние"], newdata);
      }
      $("#InjectorsBoxWid").html(html);

    })

  });


}


/* --- PS ---*/
function PSBoxShow(state)
{
  if(!state)
  {
     $("#PSBoxWid").css("display", "none");
  }
  else
  {
      $("#PSBoxWid").css("display", "");
  }

}

function PSBoxUpdate()
{

  getHostIdByName(swbN).then(id => {
    arr = ["System State", "PS Voltage #1", "PS Voltage #2", "PS Voltage #3", "PS Current #1", "PS Current #2", "PS Current #3", "PS Power #1", "PS Power #2", "PS Power #3", "PS Temp #1", "PS Temp #2", "PS Fan"];

    getItemsHost(id, arr).then(data => {
      var newdata = [];


      if(data["System State"] == "")
      {
        for(key in data)
        {
          data[key] = "-";
        }
      }
      else
      {
        for(key in data)
        {
          data[key] = stringIntToShortString(data[key]);
        }
      }






      newdata.push([ data["PS Voltage #1"] + " V", data["PS Voltage #2"]+  " V",data["PS Voltage #3"]+ " V"]);
      newdata.push([ data["PS Current #1"]+ " A", data["PS Current #2"]+ " A",data["PS Current #3"]+ " A"]);
      newdata.push([ data["PS Power #1"]+ " W",    data["PS Power #2"]+ " W",data["PS Power #3"]+ " W"]);

      newdata.push([ data["PS Temp #1"]+ " C", data["PS Temp #2"] +" C"]);
      newdata.push([ data["PS Fan"] + " RPM"]);



      $("#PSBoxWid").html("");
      if(currLang == "en")
      {
        var html = renderTableHTML("PS", "PSBoxWid", [], newdata);
      }
      else
      {
        var html = renderTableHTML("БП", "PSBoxWid", [], newdata);
      }
      $("#PSBoxWid").html(html);

    })

  });

}


/* --- DEVS --- */
function DevsBoxShow(state)
{
  if(!state)
  {
     $("#DevsBoxWid").css("display", "none");
  }
  else
  {
      $("#DevsBoxWid").css("display", "");
  }

}

function DevsBoxUpdate()
{
  getHostIdByName(swbN).then(id => {
      items = ["CPU", "GPU0", "GPU1", "FPGA #1", "FPGA #2","FPGA #3","FPGA #4"];
      limit = 100;
      getItemsHistory(id, items, limit, "numeric unsigned").then(res =>
      {

        yvals = [];
        labels = [];

        for(var i =0; i < res.length;i++)
        {
          if(res[i].data.length)
          {
            yvals.push(res[i].data);
            labels.push(res[i].name);
          }
        }

        plotId = "DevsBoxPlot";

        $("#DevsBoxWid").html("");

        switch (currLang)
        {
          case "ru":
            htmlWid = renderPlotHTML("", plotId, "PCI устройства");
            break;
          case "en":
            htmlWid = renderPlotHTML("", plotId, "PCI Devices");
            break;
          default:
              break;
        }


        $("#DevsBoxWid").html(htmlWid);

        if(SystemState == "ON")
        {
          switch (currLang)
          {
            case "ru":
              renderPlot(plotId, [], yvals, labels, " ",  "Температура, C")
              break;
            case "en":
              renderPlot(plotId, [], yvals, labels, " ",  "Temperature, C")
              break;
            default:
                break;
          }

        }


      });


  });
}


/* --- Status --- */
function StatusBoxShow(state)
{
  if(!state)
  {
     $("#StatusBoxWid").css("display", "none");
  }
  else
  {
      $("#StatusBoxWid").css("display", "");
  }

}

function StatusBoxUpdate()
{
  getHostIdByName(swbN).then(id => {
    var arr = ["System State", "Connection with PC", "Critical Error Log", "Version", "Temp overview"];

    transArr = [];
    transArr["System State"] = "Состояние";
    transArr["Connection with PC"] = "Соединение с ПК";
    transArr["Critical Error Log"] =  "Последняя ошибка";
    transArr["Version"] = "Версия";
    transArr["Temp overview"] = "Температуры";
    transArr["Chassis"] = "Шасси";

    getItemsHost(id, arr).then(data => {


      /* overv. */

      dat = data["Temp overview"];
      if(dat == "HIGH")
      {
          if(currLang == "ru")
          {
            data["Temp overview"] = "<label class=\"badge badge-primary\">Высокая</label>";
          }
          else
          {
            data["Temp overview"] = "<label class=\"badge badge-primary\">HIGH</label>";
          }
      }
      else if (dat == "CRITICAL")
      {
        if(currLang == "ru")
        {
              data["Temp overview"] = "<label class=\"badge badge-danger\">Критическая</label>";
        }
        else
        {
            data["Temp overview"] = "<label class=\"badge badge-danger\">CRITICAL</label>";
        }
      }

      /* errlog */

      dat = data["Critical Error Log"];
      dat = dat.split(":");
      dat = dat[1];

      if(!dat.includes("OK"))
      {
        data["Critical Error Log"]= "<label class=\"badge badge-danger\">"+ dat +  "</label>";
      }
      else
      {
        data["Critical Error Log"] = dat;
      }


      /* pc */
      dat = data["Connection with PC"];

      if(dat.includes("FAILED"))
      {
        if(currLang == "en")
        {
          dat = "<label class=\"badge badge-danger\">Failed</label>";
        }
        else
        {
            dat = "<label class=\"badge badge-danger\">Ошибка</label>";
        }
      }

      data["Connection with PC"] = dat;

      var newdata = [];



      for(var i =0; i < arr.length;i++)
      {
        var name;
        if(currLang == "ru")
        {
          name = transArr[arr[i]];
        }
        else
        {
          name = arr[i];
        }

        dat = data[arr[i]];
        if(!dat || dat == "0")
        {
          dat = "-";
        }

        newdata.push([name, dat]);
      }

      $("#StatusBoxWid").html("");

      switch (currLang)
      {
        case "ru":
          var html = renderTableHTML("Состояние системы", "StatusBoxWid", [" ", ""], newdata, true);
          break;
        case "en":
          var html = renderTableHTML("Status", "StatusBoxWid", [" ", ""], newdata, true);
          break;
        default:

      }

      $("#StatusBoxWid").html(html);




    });
  });
}

/* --- */

function generateCallbackList()
{
  arr = [];
  arr["FansBox"] = FansBoxShow;
  arr["InjectorsBox"] = InjectorsBoxShow;
  arr["PSBox"] = PSBoxShow;
  arr["DevsBox"] = DevsBoxShow;
  arr["StatusBox"] = StatusBoxShow;
  return arr;
}

function generateUpdateList()
{
  arr = [];
  arr["FansBox"] = FansBoxUpdate;
  arr["InjectorsBox"] = InjectorsBoxUpdate;
  arr["PSBox"] = PSBoxUpdate;
  arr["DevsBox"] = DevsBoxUpdate;
  arr["StatusBox"] = StatusBoxUpdate;

  return arr;
}


function updateAllData()
{

  updateZabStat();
  updateSystemState();

  arr = generateUpdateList();

  for (var key in arr)
  {
    arr[key]();
  }
}

function initButtons()
{
    $( "#FansBox" ).on( "click", handleButtons);
    $( "#InjectorsBox" ).on( "click", handleButtons);
    $( "#PSBox" ).on( "click", handleButtons);
    $( "#DevsBox" ).on( "click", handleButtons);
    $( "#StatusBox" ).on( "click", handleButtons);
}



function handleButtons()
{

  updateSystemState();


  var allList = ["FansBox", "InjectorsBox", "PSBox", "DevsBox", "StatusBox"];
  callList = generateCallbackList();
  updateList = generateUpdateList();
  var widPostfix = "Wid";


  for(var i =0; i < allList.length;i++)
  {
    if($("#" + allList[i]).prop("checked")) /* пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ */
    {
      if(!currList.includes(allList[i] + widPostfix)) /* пїЅ пїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅ */
      {
        currList.push(allList[i] + widPostfix);

        /* пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ */

        updateList[allList[i]]();
        callList[allList[i]](true);

      }
    }
    else /* пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅ пїЅпїЅпїЅпїЅпїЅ */
    {
      if(currList.includes(allList[i] + widPostfix)) /* пїЅ пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅ пїЅпїЅпїЅпїЅ */
      {
        var index = currList.indexOf(allList[i] + widPostfix);
        if (index !== -1)
        {
          currList.splice(index, 1);
         }
        /* пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ */
        callList[allList[i]](false);

      }
    }

  }
}


function renderTableHTML(name, id,  _top, data, leftTh)
{
  var html = "";


  //html = html + "<div class=\"col-lg-6 col-md-4\" id=\"" + id + "\">";
  html = html + "<div class=\"grid\"><div class=\"grid-body\">";
  html = html + "<h2 class=\"grid-title\">" + name + "</h2>";
  html = html + "<div class=\"item-wrapper\">";
  html = html + "<div class=\"table-responsive\">";
  html = html + "<table class=\"table table-hover table-sm\">";


  /* generate top */
  var top = "<thead>";
  if(!leftTh)
  {
    top = top + "<tr class=\"solid-header\">";
    for(var i = 0; i < _top.length;i++)
    {
      top = top + "<th>" + _top[i]  + "</th>";
    }
    top = top + "</tr>";
  }
  top = top + "</thead>";
  html = html + top;

  /* generate table body */
  var body = "<tbody>"
  for(var  i =0; i < data.length;i++) /* пїЅпїЅпїЅпїЅпїЅпїЅ */
  {
    body = body + "<tr>";
    for(var j =0; j < data[i].length;j++) /* пїЅпїЅпїЅпїЅпїЅпїЅпїЅ */
    {
        if(leftTh && j == 0)
        {
          body = body + "<td style='background: #fafafa;font-weight: 600;'>" + data[i][j] + "</td>";
        }
        else
        {
          body = body + "<td>" + data[i][j] + "</td>";
        }

    }
    body = body + "</tr>";
  }
  body = body + "</tbody>";
  html = html + body;


  html = html + "</table></div></div></div></div>";
  //html = html + "</div>";

  return html;
}

function renderPlotHTML(id, plotId, name)
{
  var html = "";


  html = html + "<div class=\"grid\"><div class=\"grid-body\">";
  html = html + "<h2 class=\"grid-title\">" + name + "</h2>";
  html = html + "<div class=\"item-wrapper\">";
  html = html + "<canvas id=\"" + plotId + "\"></canvas>";
  html = html +  "</div></div></div>";
  return html;
}

function renderPlot(plotId, xval, yvals, labels, xLabel, yLabel)
{
  var chartColors = ["#696ffb", "#7db8f9", "#05478f", "#00cccc", "#6CA5E0", "#1A76CA"];

  var _datasets = new Array();



  for(var i = 0; i < yvals.length;i++)
  {


    tmp = {
              data: yvals[i],
              fill: false,
              label: labels[i],
              backgroundColor: chartColors[i],
              borderColor: chartColors[i],
            };

    _datasets.push(tmp);
  }

  var options =
    {
        type: "line",
        data :
        {
          datasets: _datasets,
        },
        options:
        {
          animation: false,
          scales: {
              xAxes: [{
                  type: 'linear',
                  position: 'bottom',
                  ticks: {
                      display: false
                  }
              }]
          }
    },

    }

    var ctx = document.getElementById(plotId).getContext('2d');
    new Chart(ctx, options);


}


/* -------------------- */


function clearMenu()
{
  $("#menuGenerator").empty();
}

function addToMenu(text_link)
{
  text =  "<li><a href=\"devs.html?dev=" + text_link + "\">";
  text = text +  "<span class=\"link-title\">" + text_link + "</span>";
  text = text +  "<i class=\"mdi mdi-laptop-windows\"></i></a></li>";
  $("#menuGenerator").append(text);
}

function writeLog(text)
{
  msg = text;
  text = "<div class=\"dropdown-list\"><div class=\"content-wrapper\">";
  text = text + "<small class=\"content-text\">" + getTime() + " : " +  msg  + "</small>";
  text = text + "</div></div>";
  $("#logBox").append(text);

  $("#logIcon").html("<span class=\"notification-indicator notification-indicator-primary\"></span>");
}

function afterTrans()
{
  updateAllData();
  parseParams();
}

function onDocumentLoad()
{
    initTrans()
    setCallBack(afterTrans);

    $( "#logStatus" ).on( "click", function(){ $("#logIcon").text(""); });
    setTimeout( updateMenu, 500);
    parseParams();
    initButtons();
    $("#swbUpdate").on("click", updateAllData);

    setTimeout(handleButtons, 500);
    setTimeout(updateZabStat, 500);

    $("#autoUpdate").on("click", function(){
      if($("#autoUpdate").prop("checked"))
      {
        	timeoutIdUpdate = setInterval(updateAllData, 5000);
      }
      else
      {
          clearInterval(timeoutIdUpdate);
      }
    });
}



function updateMenu()
{
  getHostsByTemplate(TEMPL_NAME)
	.then(swbList => {
    clearMenu();
    for(var i =0; i < swbList.length;i++)
    {
      addToMenu(swbList[i].name);
    }
  });
}

function getTime()
{
  var now = new Date();
  time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  return time;
}

window.addEventListener('load', function ()
{
  if(!window.jQuery)
  {
    console.log("jQuery load failed!");
  }
  else
  {
    console.log("jQuery load succ.");
  }


  /* DBG */
  //loginZabbix('192.168.153.81', 'API', 'API')
  loginZabbixDB()
  .then(res => {
    if(res)
    {
      writeLog('Login in Zabbix successful');
    }
    else
     {
      writeLog('Login in Zabbix failed');
    }
  });

  $(document).ready(onDocumentLoad);

});


function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function parseParams()
{
  swbN = getParameterByName('dev');

  text = "  detailed information";

  if(currLang == "ru")
  {
    text = "  детальная информация";
  }

  $('#swbN').html(swbN + text);
}
