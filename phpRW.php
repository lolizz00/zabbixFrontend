<?php

  $resp = array();


  if ($_SERVER['REQUEST_METHOD'] === 'POST')
  {
      if($_POST['call'] == "saveConfZab")
      {
          if(isset($_POST["host"]) &&  isset($_POST["user"]) && isset($_POST["host"]))
          {
            $host = $_POST["host"];
            $user = $_POST["user"];
            $pass = $_POST["pass"];

            $res = saveConfZab($host, $user, $pass);
            $resp['result'] = $res;
          }
          else
          {
              $resp['result'] = "Wrong args";
          }
      }
      elseif($_POST['call'] == "readZabConf")
      {
        $data = readZabConf();
	if(strpos($data, "Error" ) !== false)
        {
          $resp['result'] = $data;
        }
        else
        {
            $data = explode("\n", $data);
            $resp['host'] = $data[0];
            $resp['user'] = $data[1];
            $resp['pass'] = $data[2];
            $resp['result'] = "OK";
        }

      }
      else
      {
        $resp['result'] = "Wrong call";
      }
  }
  else
  {
      $resp['result'] = "ONLY POST";
  }

  echo json_encode($resp);



  function readZabConf()
  {
      $fName = "zab.conf";
      $fHandle = fopen($fName, 'r');
      if($fHandle === false) { return "Error while read file"; }
      $DATA = fread($fHandle, filesize($fName));
      fclose($fHandle);
      return $DATA;
  }

  function saveConfZab($host, $user, $pass)
  {
    $fName = "zab.conf";
    $fHandle = fopen($fName, 'w');
    if($fHandle === false) { return "Error while write file"; }
    $Data = $host . "\n" . $user . "\n" . $pass;
    fwrite($fHandle, $Data);
    fclose($fHandle);
    return "OK";
  }

?>
