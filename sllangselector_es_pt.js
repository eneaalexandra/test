/*!
 * Smartling Language selector
 * Version 1.3
 * https://www.smartling.com/
 */

var slTimeoutEnabled = true;
var slTimeoutIteration=0;
var slMaxTimeoutIterations=200;
var slTimeoutDelay = 50;
var slLangSpanId = "slDropdownLanguage";
var slLocales = [{"name":"English","url":""}
                ,{"name":"中文(简体)","url":"/lang-zh_CN"}
                ,{"name":"Français","url":"/lang-fr"}
                ,{"name":"Deutsch","url":"/lang-de"}
                ,{"name":"日本語","url":"/lang-ja"}
                ,{"name":"Pусский","url":"/lang-ru"}
				,{"name":"Español (España)","url":"/lang-es"}
				,{"name":"Português (Brasil)","url":"/lang-pt_BR"}];

function slOnClickOutsideLangSpan(e) {
    var path = e.composedPath()
    for (var i = 0; i < path.length; i++) {
        if (path[i].id === slLangSpanId) {
            return;
        }
    }

    var sp = document.getElementById(slLangSpanId);
    if (sp != null) {
        sp.classList.remove("open")
        document.body.removeEventListener("click", slOnClickOutsideLangSpan);
    }
}


function slOnClickLangSpan(e) {
    event.stopPropagation();
    if (e.currentTarget.classList.contains("open")) {
        e.currentTarget.classList.remove("open");
        document.body.removeEventListener("click", slOnClickOutsideLangSpan);
    }else{
        e.currentTarget.classList.add("open")
        document.body.addEventListener("click", slOnClickOutsideLangSpan, true);
        var ul = document.querySelector("span#"+slLangSpanId+" ul");
        if (ul != null) {
            ul.innerHTML = slGenerateLocaleAnchors();
        }
        var openSpan = e.currentTarget.parentElement.querySelector("span[dropdown][class~=open]");
        if (openSpan != null) {
            openSpan.classList.remove("open");
        }
    }
}

function slGetLanguageName() {
    var langUrlPath = /(\/lang-[a-zA-Z_]{2,5})/.exec(window.location.pathname);

    var result = "English"
    if (langUrlPath != null) {
        langURL = langUrlPath[1];
        for (var i = 0; i < slLocales.length; i++) {
            if(langURL == slLocales[i].url) {
                result = slLocales[i].name;
            }
        }
    }
    return result;
}

function slGenerateLocaleAnchors() {
    var urlpath = window.location.pathname;

    var head = ""
    var lang = ""
    var tail = ""
    var path = /^(\/(?!lang-)[^\/]+)?(\/lang-[a-zA-Z_]{2,5})?(.*)/.exec(urlpath);

    if (path != null) {
        head = path[1]
        lang = path[2]
        tail = path[3]
    }
    if (head == undefined) {
        head = ""
    }
    if (lang == undefined) {
        lang = ""
    }

    var res = '';
    var active_class = '';
    for (var i = 0; i < slLocales.length; i++) {
        if(lang == slLocales[i].url) {
            active_class = 'class="active"'
        } else {
            active_class = ''
        }
        var localeUrl = slLocales[i].url;
        if(""==head && ""==localeUrl && ""==tail) {
            localeUrl = "/"
        }
        res = res + '<li><a target="_self" '+active_class+' href="'+head+localeUrl+tail+'">'+slLocales[i].name+'</a></li>'
    }
    return res
}

function slInsertLangSpan() {
    var sp = null;
    var d = document.querySelector("div[class~=hub-subheader-breadcrumbs]");
    if (d!=null) {
        sp = d.querySelector("span[dropdown]");
    }
    if (sp == null) {
        slTimeoutIteration = slTimeoutIteration + 1;
        if(slTimeoutIteration > slMaxTimeoutIterations) {
            console.error("Can't set Smartling language selector on the page.");
        }else {
            setTimeout(slInsertLangSpan, slTimeoutDelay);
        }
    } else {
        var sp1 = document.createElement("span");
        sp1.id = slLangSpanId
        sp1.style = "cursor:pointer"
        sp1.className = "left-dropdown language dropdown sl-dropdown-language";
        sp1.innerHTML = '<a dropdown-toggle class="hub-breadcrumb-item dropdown-toggle"><span>'+slGetLanguageName()+'</span><i class="fa fa-chevron-down"></i></a><ul dropdown-menu="" class="dropdown-menu">'+slGenerateLocaleAnchors()+'</ul>';
        sp1.addEventListener("click", slOnClickLangSpan, true);

        var spanInsertBefore = sp.nextSibling;
        var parentDiv = sp.parentNode;
        parentDiv.insertBefore(sp1, spanInsertBefore);
        parentDiv.removeChild(spanInsertBefore);
    }
}

if(slTimeoutEnabled) {
    setTimeout(slInsertLangSpan, slTimeoutDelay);
}
