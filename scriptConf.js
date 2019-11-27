var TEMPL_NAME = 'SWB_TEMPL';
var UPD_INTERVAL = 3000;

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

function onDocumentLoad()
{
    initTrans();
    $( "#logStatus" ).on( "click", function(){ $("#logIcon").text(""); });
    setTimeout( updateMenu, 500);

    $("#testUser").on("click", handleTestUser);
    $("#saveUser").on("click", handleSaveUser);
}



function setStatus(state)
{
  if(state == "OK")
  {
    $("#statusComm").html("<label class='badge badge-primary'>OK</label>");
  }
  else if (state == "ERR")
  {
    $("#statusComm").html("<label class='badge badge-danger'>Error</label>");
  }
  else if (state == "CLR")
  {
    $("#statusComm").html("");
  }
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

  //zabbix.logout();
}

function getTime()
{
  var now = new Date();
  time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  return time;
}


function handleTestUser()
{
   var host = $("#inputHost").val();
   var user = $("#inputUser").val();
   var pass = $("#inputPassword").val();

   setStatus("CLR");
   testLogin(host, user, pass).then(res => {
      if(res)
      {
        setStatus("OK");
      }
      else
      {
        setStatus("ERR");
      }
   });

}

function handleSaveUser()
{
  var host = $("#inputHost").val();
  var user = $("#inputUser").val();
  var pass = $("#inputPassword").val();

  setStatus("CLR");

  writeConfZab(host, user, pass).then(res =>
  {
    res = JSON.parse(res);
    if(res["result"] == "OK")
    {
      setStatus("OK");
    }
    else
    {
      setStatus("ERR");
    }
  });

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
