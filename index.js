//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"  //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
} from "./utils.js"

import { initLogin,logout } from "./pages/login/login.js"

import { initUpdateNews } from "./pages/news-admin/news-update/news-admin-update.js"
import { initCreateNews } from "./pages/news-admin/news-create/news-admin-create.js"

import { initAllVinyls} from "./pages/vinyl/showVinyls.js";

import { initCreateEvent } from "./pages/events-admin/event-create/event-admin-create.js";
import { initUpdateEvent } from "./pages/events-admin/event-update/event-admin-update.js";


window.addEventListener("load", async () => {

  const templateLogin = await loadTemplate("./pages/login/login.html")

  const templateUpdateNews = await loadTemplate("./pages/news-admin/news-update/news-admin-update.html")
  const templateCreateNews = await loadTemplate("./pages/news-admin/news-create/news-admin-create.html")

  const templateVinyls = await loadTemplate("./pages/vinyl/showVinyls.html")

  const templateCreateEvent = await loadTemplate("./pages/events-admin/event-create/event-admin-create.html")
  const templateUpdateEvent = await loadTemplate("./pages/events-admin/event-update/event-admin-update.html")

  adjustForMissingHash()

  if(localStorage.getItem("token") == null){
    document.getElementById("news-edit").style.display = "none"
    document.getElementById("event-edit").style.display = "none"
    document.getElementById("login-id").style.display="block"
    document.getElementById("logout-id").style.display="none"
  }

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      
      "/login": () => {
        renderTemplate(templateLogin, "content")
        initLogin()
      },
      "/": () => {
        renderTemplate(templateLogin, "content")
        initLogin()
      },
      "/logout": () => {
        logout()
      },
      "/news/create": () => {
        renderTemplate(templateCreateNews, "content")
        initCreateNews()
      },
      "/news/update": (match) => {
        renderTemplate(templateUpdateNews, "content")
        initUpdateNews(1, match)
      },
      "/vinyl": () => {
        renderTemplate(templateVinyls, "content")
        initAllVinyls()
        },
      "/event/create": () => {
        renderTemplate(templateCreateEvent, "content")
        initCreateEvent()
      },
      "/event/update": (match) => {
        renderTemplate(templateUpdateEvent, "content")
        initUpdateEvent(1, match)
      },
    })
    .notFound(() => {
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}