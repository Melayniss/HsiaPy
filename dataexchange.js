// JavaScript Document

function init(){
  Boolean isNew=true;
  var currentInfo = getInfo();//用户信息
  
  document.getElementById('logo-img').src = currentInfo[1];//用户头像
  if(currentInfo.length<3){
    PandaPython.newProject
  }//新建PandaPython项目
  else{
	isNew=false;
    var reqParams = {
      name: currentInfo[0],
      projectName: currentInfo[2]
    };
  
    $.ajax({
      type: "POST",
      url: "test.jsp",
      data: reqParams,
      dataType: "json", 
      success: function(data){
        if (data.result){
          PandaPython.clearProject();
          // PandaPython.workspaceChanged();
          // turn xml data object into a string that Blockly can use
          var xmlString;
          //IE
          if (window.ActiveXObject){
            xmlString = data.file.xml;
          }
      // code for Mozilla, Firefox, Opera, etc.
      else{
          xmlString = (new XMLSerializer()).serializeToString(data.file);
      }
      // console.log(xmlString);
      // load xml blocks
      var xml = Blockly.Xml.textToDom(xmlString);
      Blockly.Xml.domToWorkspace(xml, PandaPython.workspace); 
      Blockly.svgResize(PandaPython.workspace);
      // update project name
      $('#project-name').val(currentInfo[0]);
      // we just got a new project.  It doesn't need saving yet.
      setTimeout(PandaPython.setSaveNeeded, 300);
        }else{
          alert(data.msg);
        }
      },
      error:function(jqXHR){
        alert("发生错误："+jqXHR.status);
      },
    });
  }
}

/*PandaPython.saveBlocksRemote = function() {
  var xmlDom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
  var xmlText = Blockly.Xml.domToText(xmlDom);
  var blob = new Blob([xmlText], {type: "text/plain;charset=utf-8"});


  // pull a filename entered by the user
  var blocks_filename = $('#project-name').val();

  //get user info
  var currentInfo=getInfo();
  if (blocks_filename) {
    //组装formdata
    var fd = new FormData();
    fd.append("name",currentInfo[1]);
    fd.append("blocksName", blocks_filename);//blocksName为自定义
    fd.append("blocksData", blob);//blocksData为自定义

  //需要注意的是服务端需要设定，允许跨域请求。数据接收的方式和<input type="file"/> 上传的文件没有区别
  $.ajax({
    type:"POST",
    url:"http://192.168.0.110:8080/PandaPython",
    data:fd,
    //必须false才会自动加上正确的Content-Type
    contentType:false, 
    //必须false才会避开jQuery对 formdata 的默认处理,XMLHttpRequest会对 formdata 进行正确的处理
    processData:false, 
    success:function(res){
      if (res.result){
        alert(res.msg);
      }else{
        alert("保存失败！请稍候重试！");
      }
    },
    error:function(jqXHR){
      alert("发生错误："+jqXHR.status);
    },
  });
  }
  else {
    alert(PandaPython.Msg.SAVE_FAILED + '!\n' + PandaPython.Msg.SAVE_FAILED_PROJECT_NAME);
  }

};
*/