var zabbixStatus = false;
var zabbix;


function loginZabbixDB()
{
  return readConfZab().then(data =>
  {

    data = JSON.parse(data);
    return loginZabbix(data["host"], data["user"], data["pass"]);
  })
}

function readConfZab()
{
  result = [];

  var prom = $.post( "phpRW.php", {call : "readZabConf"}).then(data =>
  {
    return data;
  });

  return prom;
}

function writeConfZab(_host, _user, _pass)
{
  var prom = $.post( "phpRW.php", {call : "saveConfZab", host : _host, user: _user, pass: _pass});
  return prom;
}


function getHostStatename(name)
{
  if(!zabbixStatus){ console.log("Try to use Zabbix without login!"); return;}

  var prom = zabbix.call("host.get", {filter: { name: name  } } ).then(res => {
    res = res.result;
    res = res[0];
    res = res.error;
    if(res== "")
    {
      res = "OK";
    }
    return res;
  });
  return prom;
}

function getHostIdByName(name)
{
  if(!zabbixStatus){ console.log("Try to use Zabbix without login!"); return;}

  var prom = zabbix.call("host.get", {filter: { name: name  } } ).then(res =>{
    res = res.result;
    res = res[0];
    res = res.hostid;
    //console.log(res);
    return res;
  });

  return prom;

}

function readItemsList(swbList, dataList)
{


  var hostids = new Array();

  for(var i =0; i < swbList.length;i++){ hostids.push(swbList[i].id); }

  var prom = getItemsManyHosts(hostids, dataList).then(res =>
  {
      for(var i =0; i < res.length;i++)
      {
          swb = swbList.filter(swb => swb.id == res[i].id);
          name = res[i].name;
          value = res[i].value;
          swb[0][name] = value;
      }

      //console.log(swbList);
      return swbList;

  });

  return prom;
}

function getItemsManyHosts(_hostids, _names)
{
  if(!zabbixStatus){ console.log("Try to use Zabbix without login!"); return;}

  var prom = zabbix.call("item.get", {filter: { hostid: _hostids, name: _names  } } )
  .then(res => {

    res = res.result;

    var ret = new Array();

    for(var i =0; i < res.length;i++)
    {
      ret.push( {id : res[i].hostid, name: res[i].name, value: res[i].lastvalue} );
    }

    //console.log(ret);
    return ret;



  })
  .catch(err => {
    console.log("getItemByHostName() Error: " + err);
  });

  return prom;

}

/*
  Get Item
  _hostid : id of host, string
  _name: string array, names of items
*/
function getItemsHost(_hostid, _names)
{
  if(!zabbixStatus){ console.log("Try to use Zabbix without login!"); return;}

  var prom = zabbix.call("item.get", {filter: { hostid: _hostid, name: _names  } } )
  .then(res => {
    res = res.result;
    ret = new Array();
    for(var i =0; i < res.length;i++)
    {
      ret[res[i].name] = res[i].lastvalue;
    }
    return ret;

  })
  .catch(err => {
    console.log("getItemByHostName() Error: " + err);
  });

  return prom;

}

function convertUnixTime(val)
{
  val = parseInt(val, 10);
  var date = new Date(val*1000);
  var formatted = date.getDay() + '.' +date.getMonth() +' ' + date.getHours() + ':' + date.getMinutes();
  return formatted;
}

function converUnixTimeArr(arr)
{
  var ret = Array();
  for(var i =0; i < arr.length;i++)
  {
    ret.push(convertUnixTime(arr[i]));
  }
  return ret;
}

/*
Login in Zabbix
*/
function loginZabbix(addr, login, pass)
{
  console.log("Try to login in Zabbix...");
  zabbix = new Zabbix('http://' + addr + '/zabbix/api_jsonrpc.php', login, pass);

  var prom = zabbix.login()
	.then(res => {
		console.log("Login: OK");
	  zabbixStatus = true;
    return true;
	})
	.catch(exp => {
		console.log("Login: Failed!");
    zabbixStatus = false;
    return false;
	});


  return prom;
}


function testLogin(addr, login, pass)
{
    t_zab = new Zabbix('http://' + addr + '/zabbix/api_jsonrpc.php', login, pass);

    var prom = t_zab.login().then(res =>
    {
      return true;
    })
    .catch(exp =>
    {
      console.log(exp);
      return false;
    });

    return prom;
}


/*
  Get history of item

  _id : id of target host, string
  _name : name of item, string
  _limit : int, histrory len
  _type: type of target data
    -"numeric float"
    -"character"
    -"log"
    -"numeric unsigned"
    -"text"

 */
function getItemHistory(_hostid, _name, _limit, _type)
{
  if(!zabbixStatus){ console.log("Try to use Zabbix without login!"); return;}

	var typ = {"numeric float" : 0, "character" : 1, "log" : 2, "numeric unsigned" : 3, "text" : 4};
	_type = typ[_type];


	var prom = zabbix.call("item.get", {filter: { hostid: _hostid, name: _name  } } )
	.then(res => {
			res = res["result"];
			res = res[0];
			res = res.itemid;
			return res;
	})
	.then(res => {
		return zabbix.call("history.get", { itemids: res, limit: _limit , history: _type, sortfield : "clock", sortorder: "DESC"})
	})
	.then(res => {
		res = res.result;
		var ret = {x : [], y: []};

		for(var i =0; i < res.length;i++)
		{
			ret.x.push(parseInt(res[i].clock, 10));
			ret.y.push(parseInt(res[i].value, 10));
		}

		return ret;

	})
	.catch(err => {
		  console.log("getItemHistory() Error: " + err);
	});

  return prom;
}

function getItemsHistory(_hostid, _names, _limit, _type)
{
  var itemNameDict = [];

  if(!zabbixStatus){ console.log("Try to use Zabbix without login!"); return;}

  var typ = {"numeric float" : 0, "character" : 1, "log" : 2, "numeric unsigned" : 3, "text" : 4};
  _type = typ[_type];


  var prom = zabbix.call("item.get", {filter: { hostid: _hostid, name: _names  } } )
  .then(res => {
      res = res["result"];

      ret = [];
      for(var i =0; i < res.length;i++)
      {
        itemNameDict[res[i].name] =  res[i].itemid;
        ret.push(res[i].itemid);
      }

      return ret;
  })
  .then(res => {
    return zabbix.call("history.get", { itemids: res, limit: _limit, history: _type, sortfield : "clock", sortorder: "DESC"})
  })
  .then(res => {
    res = res.result;

    ret = [];

    for(var i =0; i < _names.length;i++)
    {
      ret.push({name : _names[i], data: [], id: itemNameDict[_names[i]]});
    }

    for(var i = res.length -1; i >=0;i--)
    {
      tmp = ret.filter(el => el.id == res[i].itemid);
      tmp = tmp[0];
      tmp.data.push({x: tmp.data.length, y: parseInt(res[i].value, 10)});
      //tmp.data.push(parseInt(res[i].value, 10));
    }

    return ret;


  })
  .catch(err => {
      console.log("getItemHistory() Error: " + err);
  });

  return prom;
}




/*
  Get Item
  _hostid : id of host, string
  _name: string, name of item
*/
function getItemByHostName(_hostid, _name)
{
  if(!zabbixStatus){ console.log("Try to use Zabbix without login!"); return;}

  var prom = zabbix.call("item.get", {filter: { hostid: _hostid, name: _name  } } )
  .then(res => {

      res = res["result"];
      res = res[0];
      tmp = { value: res["lastvalue"], units: res["units"] };
      return tmp;
  })
  .catch(err => {
    console.log("getItemByHostName() Error: " + err);
  });

  return prom;
}


function getHostsByTemplate(templatename)
{

  if(!zabbixStatus){ console.log("Try to use Zabbix without login!"); return;}

  var prom = zabbix.call("template.get", { filter: { host: [templatename] }})
   .then(r => {
      r = r["result"][0].templateid;
      return zabbix.call("host.get", {filter: {templateids : r} });
   })
   .then(r => {
     var swbList = Array();
     r = r["result"]
     for(var i = 0; i < r.length;i++)
     {
       _name = r[i]["name"];
       _id = r[i]["hostid"];
       _status = r[i]["error"];
       swbList.push({name : _name, id: _id, status : _status});
     }

     return swbList;

   })
   .catch(err => {
     console.log("getHostsByTemplate() Error: " + err);
   });

   return prom;


}
