function nordomaticIsItIE() {
  user_agent = navigator.userAgent;
  var is_it_ie = user_agent.indexOf("MSIE ") > -1 || user_agent.indexOf("Trident/") > -1;
  return is_it_ie;
}

function nordomaticCreateCookie(name,value,days,path) {
  if (days) {
     var date = new Date();
     date.setTime(date.getTime()+(days*24*60*60*1000));
     var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path="+path;
}

function nordomaticReadCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==" ") c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function nordomaticDestroy() {
  nordomaticCreateCookie('seen-browser-message','yes', 3, "/");
  var overlay = document.getElementById("browser-overlay");
  overlay.parentNode.removeChild(overlay);
}

if (nordomaticIsItIE()) {
  var browserCookie = nordomaticReadCookie("seen-browser-message");
  if (browserCookie !== "yes") {

    var infoText = "";
    var infoClose = "";

    var pathArray = window.location.pathname.split("/");
    switch (window.location.pathname.substring(0, 4)) {
      case "/sv/":
        infoText = "Du använder en föråldrad webbläsare (Internet Explorer). Använd en uppdaterad webbläsare för att besöka webbplatsen.";
        infoClose = "Stänga";
        break;

      case "/da/":
        infoText = "Du bruger en forældet browser (Internet Explorer). Brug venligst en opdateret browser til at se websitet.";
        infoClose = "Luk";
        break;

      case "/no/":
        infoText = "Du bruker en utdatert nettleser (Internet Explorer). Bruk en oppdatert nettleser for å se nettstedet.";
        infoClose = "Lukk";
        break;

      default:
        infoText = "You are using an outdated browser (Internet Explorer). Please use an updated browser to view the website.";
        infoClose = "Close";

    }

    var content = '<div class="modal" id="browser-modal" style="position: fixed; z-index: 100; left: 0; top: 0; width: 100%; height: 100%;  overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);">' +
     '  <div class="modal-content" style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">' +
     '    <div class="modal-header">' +
     '      <span id="modal-close" class="modal-close" style="color: #aaa; float: right; font-size: 28px; font-weight: bold;">&times;</span>' +
     '    </div>' +
     '    <div class="modal-body">' +
     '      <p>' + infoText + '</p>' +
     '    </div>' +
     '    <div class="modal-footer">' +
     '      <button id="modal-close-button">' + infoClose + '</button>' +
     '    </div>' +
     '  </div>' +
     '</div>';

     var overlay = document.createElement("DIV");
     overlay.innerHTML = content;
     overlay.setAttribute("id", "browser-overlay");
     document.body.appendChild(overlay);

     var styleElement = document.createElement('style');
     var sheet;

     document.head.appendChild(styleElement);
     sheet = styleElement.sheet;

     var styles = '.modal-close:hover, modal-close:focus {' +
       'color: black; text-decoration: none; cursor: pointer;' +
    '}';
    sheet.insertRule(styles, 0);

    document.getElementById("modal-close").addEventListener("click", nordomaticDestroy);
    document.getElementById("modal-close-button").addEventListener("click", nordomaticDestroy);
  }
}
