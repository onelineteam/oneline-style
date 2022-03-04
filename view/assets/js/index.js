 function toTaroCode(content) {
  content = content.replace(/<(\/?)(p|div|span)\b/ig, "<$1View")
  content = content.replace(/<(\/?)(label|i|b|a)\b/ig, "<$1Text");
  content = content.replace(/<(\/?)(img\b)/ig, "<$1Image");
  content = content.replace(/<(\/?)(button\b)/ig, "<$1Button");
  content = content.replace(/<(\/?)(input\b)/ig, "<$1Input");

  content = content.replace(/class=/ig, "className=");
  content = content.replace(/href=/ig, "href=");
  content = content.replace(/"/ig, "'");
  return content;
}


$(function () {

  $('.example-nav>li a').each(function (index, item) {
    // $(item).removeClass('active');
    const itemHref = item.getAttribute("href");
    const path = location.pathname;
    if (path === itemHref) {
     // $(".example-nav-items").css("display", "none");
      $(item).parents(".example-nav-items").css("display", "block");
      $(item).addClass('active');
    } else {
      $(item).removeClass('active');
    }
  })

  $('.example-nav>li h3').click(function(){
    let val = "none";
    if($(this).next().css("display") == "none") val = 'block';
     $(this).next().css("display", val);
  })


  makeActions();
})

function insertToVsCode(elm, type){
  $(elm).click(function () { 
    const target = '#' + $(this).attr('target');
    const clone = $(target).clone();
    clone.removeAttr('id');
    const content = clone[0].outerHTML; 
    sendToVsCode(type=='taro'?toTaroCode(content): content);
  })

}

function copyCode(elm, type) {

  const copy = new ClipboardJS(elm, {
    text(target) {
      const t = '#' + $(target).attr('target');
      const clone = $(t).clone();
      clone.removeAttr('id');
      let content = clone[0].outerHTML;
      return type == 'taro'?toTaroCode(content):content;
    }
  })
  
  copy.on('success', function () {
    alert("复制代码成功");
  });
  

}


function sendToVsCode(content) {
  window.parent.postMessage({
    type: 'insertCode',
    code: content
  }, "*");
}

//makeActions
function makeActions() {

  const actions = $(".code-box-actions");
  actions.each(function(index, item) {
    const action = $(item);
    const target = action.attr('target');
  
  let html = `
      <span class="copy" title="复制普通" target='{{target}}'><i class="fa fa-file"></i> 复制</span>
      <span class="copy-taro" title="复制Tarojs" target='{{target}}'><i class="fa fa-file"></i> 复制为Taro</span>
      <span class='vscode ol-c_primary' title='插入到vscode中' target='{{target}}'><i class='fa fa-file-code'></i> 原始代码</span> 
      <span class='vscode-taro ol-c_primary' title='插入到vscode中' target='{{target}}'><i class='fa fa-file-code'></i> Taro代码</span> 
  `
  html = html.replace(/{{target}}/ig, target); 

  action.html(html);

  })
  

  copyCode('.copy-taro', 'taro');
  copyCode('.copy');
  insertToVsCode('.vscode');
  insertToVsCode('.vscode-taro', 'taro');

}