//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"  //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
} from "./utils.js"

import { initLogin,logout } from "./pages/login/login.js"

import { initAllVinyls} from "./pages/vinyl/showVinyls.js";

import { initCreateEvent } from "./pages/event-create/event-admin-create.js";
import { initUpdateEvent } from "./pages/event-update/event-admin-update.js";


window.addEventListener("load", async () => {

  const templateLogin = await loadTemplate("./pages/login/login.html")

  const templateVinyls = await loadTemplate("./pages/vinyl/showVinyls.html")

  const templateCreateEvent = await loadTemplate("./pages/event-create/event-admin-create.html")
  const templateUpdateEvent = await loadTemplate("./pages/event-update/event-admin-update.html")

  adjustForMissingHash()

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
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => document.getElementById("content").innerHTML = `
        <h2>Home</h2>
        <img style="width:50%;max-width:600px;margin-top:1em;" src="./images/cars.png">
        <p style='margin-top:1em;font-size: 1.5em;color:darkgray;'>
          Temp message <span style='font-size:2em;'>&#128516;</span>
        </p>
     `,
      "/login": () => {
        renderTemplate(templateLogin, "content")
        initLogin()
      },
      "/logout": () => {
        logout()
      },

        "/vinyl": () => {
          renderTemplate(templateVinyls, "content")
            initAllVinyls()
        }

      "/event/create": () => {
        renderTemplate(templateCreateEvent, "content")
        initCreateEvent()
      },
      "/event/update": (match) => {
        renderTemplate(templateUpdateEvent, "content")
        initUpdateEvent(1, match)
      }


    })
    .notFound(() => {
    })
    .resolve()
});


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}