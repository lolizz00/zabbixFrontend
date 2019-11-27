var TEMPL_NAME = 'SWB_TEMPL';
var UPD_INTERVAL = 3000;


var timeoutIdUpdate;

function onClickswbListTableUpdate()
{
  clearSwbListTable();
  drawSwbListTable();
}


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

function clearSwbListTable()
{
  $("#swbListTable").empty();
}



function drawSwbListTable()
{


  var dataList = ["Critical Error Log", "System State", "Version", "Temp overview", "FAN #1 RPM", "FAN #2 RPM", "FAN #3 RPM", "FAN #4 RPM", "Injector #1 Status", "Injector #2 Status", "Injector #3 Status", "Injector #4 Status", "PS Power #1", "Version"];


  getHostsByTemplate(TEMPL_NAME)
	.then(swbList => {

    var text = "";

      readItemsList(swbList, dataList).then(swbList => {


      for(var i =0; i < swbList.length;i++)
      {
          text = text + createRowSwblList(swbList[i]);
      }

      $("#swbListTable").append(text);
      $("#swbListTableTime").text(getTime());

      clearMenu();
      for(var i =0; i < swbList.length;i++)
      {
        addToMenu(swbList[i].name);
      }
      //console.log(swbList);

   });



  });
}


function createRowStatus(swb)
{
  status = "";
  indicator = "";

  if(swb.status == "")
  {
    swb.status = "OK";
  }

  status = swb.status;

  if(status.length > 40)
  {
    status = status.slice(0, 30) + " ...";
  }

  if(status != "OK")
  {
    status = "<label class=\"badge badge-danger\">" + status + "</label>";
    indicator = "<span class=\"status-indicator rounded-indicator small bg-danger\"></span>";
  }
  else
  {
    indicator = "<span class=\"status-indicator rounded-indicator small bg-primary\"></span>";
  }

  return[ indicator, status];

}


function createRowState(swb)
{
  if(!swb["System State"])
  {
    return "<td>"  +"-" + "</td>" ;
  }
  else
  {
    return "<td>" + swb["System State"] + "</td>";
  }

}


function createRowPS(swb)
{

  if(swb.status != "OK")
  {
    return "<td>-</td>";
  }
  var val = swb["PS Power #1"];
  val = parseInt(val, 10);
  val = val.toString(10);
  return "<td>"  + val + " W</td>" ;

}

function createRowTemp(swb)
{

  var val =  swb["Temp overview"];
  if(!val)
  {
      return "<td>"  +"-" + "</td>" ;
  }
  else if (val == "CRITICAL")
  {
    switch (currLang)
    {
      case "en":
          return "<td><label class=\"badge badge-danger\">CRITICAL</label></td>";
        break;
      case "ru":
          return "<td><label class=\"badge badge-danger\">Критическая</label></td>";
        break;
      default:
        break;
    }

  }
  else if(val ==  "HIGH")
  {
    switch (currLang)
    {
      case "en":
            return "<td><div class=\"badge badge-primary\">HIGH</label></td>";
        break;
      case "ru":
            return "<td><div class=\"badge badge-primary\">Высокая</label></td>";
        break;
      default:
        break;
    }

  }
  else if(val == "OFF")
  {
    return "<td>"  +"-" + "</td>" ;
  }
  else if(val == "N/A")
  {
    return "<td><div class=\"badge badge-primary\">N/A</label></td>";
  }
  else
  {
    return "<td>"  +"OK" + "</td>" ;
  }
}

function createRowVer(swb)
{
  if(swb.status != "OK")
  {
    return "<td>-</td>";
  }

return "<td>" + swb['Version'] +  "</td>";

}


/* --- */

function checkInjStatus(swb)
{

  if(swb["System State"] != "ON")
  {
    return true;
  }

  for(var i =0; i < 4;i++)
  {
    var str = "Injector #" + i.toString(10) + " Status";
    val = swb[str];

    if(val == "ERR")
    {
      return false;
    }

  }

  return true;
}

function checkFanStatus(swb)
{

  if(swb["System State"] != "ON")
  {
    return true;
  }

  for(var i =0; i < 4;i++)
  {
    var str = "FAN #" + i.toString(10) +" RPM";
    val = swb[str];
    if(parseInt(val, 10) < 500)
    {
      return false;
    }
  }

  return true;

}

function checkErrStatus(swb)
{
  val = swb["Critical Error Log"];

  if(!val.includes("OK"))
  {
    return false;
  }

  return true;
}

function createRowOthStatus(swb)
{
  if(swb.status != "OK")
  {
    return "<td>-</td>";
  }

  var text = "<td>";
  var flg = false;

  if(!checkFanStatus(swb))
  {
    text = text + "<label class='badge badge-danger'>Fans</label>";
    flg = true;
  }

  if(!checkInjStatus(swb))
  {
    text = text + "<label class='badge badge-danger'>Injectors</label>";
    flg = true;
  }

  if(!checkErrStatus(swb))
  {
    text = text + "<label class='badge badge-danger'>Error</label>";
    flg = true;
  }

  if(!flg)
  {
    text = text + "OK";
  }



  text = text + "</td>";
  return text;
}


/* --- */


function createRowSwblList(swb)
{
  var text = "";

  text = text + "<tr>";

  text = text + "<td>" + createRowStatus(swb)[0] +  "</td>";
  text = text + "<td>" + swb.id +"</td><td><a href ='devs.html?dev=" + swb.name + "'>" + swb.name + "</a></td>";
  text = text + createRowState(swb);
  text = text + createRowTemp(swb);
  text = text + createRowOthStatus(swb);
  text = text + createRowPS(swb);
  text = text + createRowVer(swb);


  text = text + "</tr>";


  return text;
}

function setTemplName(name)
{
	TEMPL_NAME = name;
}

function setUpdateInterval(val)
{
	UPD_INTERVAL = val * 1000;
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

function afterTrans()
{
  onClickswbListTableUpdate();
}

function onDocumentLoad()
{
  initTrans();
  setCallBack(afterTrans);

  setTimeout( drawSwbListTable, 500);
  $( "#swbListTableUpdate" ).on( "click", onClickswbListTableUpdate);
  $( "#logStatus" ).on( "click", function(){ $("#logIcon").text(""); });


  $("#autoUpdate").on("click", function(){
    if($("#autoUpdate").prop("checked"))
    {
      	timeoutIdUpdate = setInterval(onClickswbListTableUpdate, 5000);
    }
    else
    {
        clearInterval(timeoutIdUpdate);
    }
  });
}


function getTime()
{
  var now = new Date();
  time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  return time;
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
