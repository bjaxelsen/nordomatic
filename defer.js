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

function nordomaticShouldShowPopup() {
    dismissed = localStorage.getItem("popupDismissed");

    banner = document.getElementsByClassName("cookie-banner")[0];
    if (dismissed == null || dismissed === "no") {
        banner.classlist.add("active");
    }
    else {
        banner.classlist.remove("active");
    }
}

function nordomaticDismissPopup() {
    localStorage.setItem("popupDismissed", "yes");
    banner = document.getElementsByClassName("cookie-banner")[0];
    banner.classlist.remove("active");
}

function nordomaticCookiesTexts() {
  var pathArray = window.location.pathname.split("/");
  switch (window.location.pathname.substring(0, 4)) {
    case "/sv/":
      return {
        link: "Cookies",
        header: "Ditt samtycke till spårningscookies",
        info: "Spårningscookies förser oss med data för att analysera vår webbtrafik. Vi överför inga uppgifter till tredje parter.",
        hasRejected: "Du har blockerat spårningscookies.",
        hasAccepted: "Du har accepterat spårningscookies.",
        accept: "Tillåt",
        reject: "Blockera"
      }

    case "/da/":
      return {
        link: "Cookies",
        header: "Godkend cookies",
        info: "Vi anvender cookies til statistik for at forstå brugernes adfærd på sitet. Vi overfører ikke data til tredjeparter.",
        hasRejected: "Du har afvist cookies til statistik.",
        hasAccepted: "Du har godkendt cookies til statistik.",
        accept: "Godkend",
        reject: "Blokér"
      }

    case "/no/":
      return {
        link: "Informasjonskapsler",
        header: "Godta analysekapsler",
        info: "Vi benytter oss av analytiske informasjonskapsler for å analysere hvordan våre besøkende bruker nettstedet. Der er ingen overførsel af disse personoplysninger til tredjepart.",
        hasRejected: "Du har blokkert analysekapsler.",
        hasAccepted: "Du har godtatt analysekapsler.",
        accept: "Godta",
        reject: "Nekte"
      }

    default:
      return {
        link: "Cookies",
        header: "Accept cookies",
        info: "We use tracking cookies to help us analyze how users use the website. We do not transfer data to third-parties.",
        hasRejected: "You have blocked tracking cookies.",
        hasAccepted: "You have accepted tracking cookies.",
        accept: "Allow",
        reject: "Block"
    }
  }
}

function nordomaticStopCookieConsent() {
  t=Matomo.getAsyncTracker();
  t.forgetCookieConsentGiven();
  localStorage.setItem("popupDismissed", "yes");
  localStorage.setItem("cookiesBlocked", "yes");
  var texts = nordomaticCookiesTexts();
  document.querySelector(".cookie-content__status").innerHTML = texts.hasRejected;
  setTimeout(function(){
    var cookiebox = document.querySelector(".cookiebox");
    cookiebox.classList.add("dismissed");
    cookiebox.classList.remove("active");
  }, 1000);
}

function nordomaticStartCookieConsent() {
  t=Matomo.getAsyncTracker();
  t.rememberCookieConsentGiven();
  localStorage.setItem("popupDismissed", "yes");
  localStorage.removeItem("cookiesBlocked");
  var texts = nordomaticCookiesTexts();
  document.querySelector(".cookie-content__status").innerHTML = texts.hasAccepted;
  setTimeout(function(){
    var cookiebox = document.querySelector(".cookiebox");
    cookiebox.classList.add("dismissed");
    cookiebox.classList.remove("active");
  }, 1000);
}

function nordomaticShowCookiebox() {
  var cookiebox = document.querySelector(".cookiebox");
  if (localStorage.getItem("popupDismissed") !== "yes") {
    cookiebox.classList.add("dismissed");
    cookiebox.classList.remove("active");
    localStorage.setItem("popupDismissed", "yes")
  }
  else {
    cookiebox.classList.remove("dismissed");
    cookiebox.classList.add("active");
    localStorage.removeItem("popupDismissed");
  }
}

function nordomaticCreateCookieDomElement() {
  var texts = nordomaticCookiesTexts();

  var acceptedCookies = nordomaticReadCookie("mtm_cookie_consent") !== null;

  var blockedCookies = localStorage.getItem("cookiesBlocked") === "yes";

  var dismissed = acceptedCookies || localStorage.getItem("popupDismissed") === "yes";

  if (acceptedCookies) {
    var statusText = texts.hasAccepted;
  }
  else if (blockedCookies) {
    var statusText = texts.hasRejected;
  }
  else {
    var statusText = "";
  }

  var html = '<div class="coookiebox__header" onclick="nordomaticShowCookiebox();"><span></span><span></span>' + texts.link + '</div>' +
    '<div class="cookiebox__wrapper">' +
    '<div class="cookiebox__header">' + texts.header + '</div>' +
    '<div class="cookiebox__info">' + texts.info + '</div>' +
    '<div class="cookiebox__buttons"><button class="cookiebox__button cookiebox__button--reject" onclick="nordomaticStopCookieConsent();">' + texts.reject + '</button><button class="cookiebox__button cookiebox__button--accept" onclick="nordomaticStartCookieConsent();">' + texts.accept + '</button></div>' +
    '<div class="cookie-content__status">' + statusText + '</div>';

  var cookiebox = document.querySelector(".cookiebox");

  if (cookiebox === null) {
    cookiebox = document.createElement('div');
    cookiebox.classList.add("cookiebox");
    document.body.appendChild(cookiebox);
  }

  if (dismissed) {
    cookiebox.classList.add("dismissed");
    cookiebox.classList.remove("active");
  }
  else {
    cookiebox.classList.remove("dismissed");
    cookiebox.classList.add("active");
  }

  cookiebox.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", nordomaticCreateCookieDomElement);
