import { handleHttpErrors,sanitizeStringWithTableRows } from "../../utils.js"
import { API_URL} from "../../settings.js"
import { paginator } from "../../lib/paginator/paginate-bootstrap.js"
const SIZE = 5
const navigoRoute = "event/update"


let URL = API_URL + "/events/"

export async function initUpdateEvent(pg, match){
    getEvents(pg, match)
    document.getElementById("tbody").onclick = evt => choiceButton(evt)
    document.getElementById("btn-create-event").onclick = evt => updateEvent()

}


async function getEvents(pg, match){
    const TOTAL = await getEventsTotal()

    const p = match?.params?.page || pg 
    let pageNo = Number(p)
    let queryString =  `?size=${SIZE}&page=` + (pageNo-1)
    let navigoRef = `?page=` + (pageNo)
    
    try{
    const response = await fetch(URL+queryString)
    .then(handleHttpErrors)

    const tableRows = response.map(makeTableRow).join("")

    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(tableRows)


    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }

    paginator({
        target: document.getElementById("event-paginator"),
        total: TOTAL,
        current: pageNo,
        click: getEvents
      })

      window.router?.navigate(`/${navigoRoute}${navigoRef}`, { callHandler: false, updateBrowserURL: true })
}

async function getEventsTotal(){
    try{
        const response = await fetch(URL+"total")
        .then(handleHttpErrors)
        
        if(response<SIZE){
            return 1
        }

        return Math.ceil(response/ SIZE)

    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

function makeTableRow(storeEvents){
    const eventRowString = 
    `<tr>
    <td>${storeEvents.id}</td>
    <td>${storeEvents.title}</td>
    <td>${storeEvents.description}</td>
    <td>${storeEvents.dateTime}</td>
    <td>
    <button id="btn-openmodal-${storeEvents.id}" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#event-modal">Editer</button>
    <button id="btn-remove-${storeEvents.id}" type="button" class="btn btn-warning">Slet</button>
    </td>
    </tr>` 
    return eventRowString
}

async function modalSetup(id){
    try{
        const response = await fetch(URL+id)
        .then(handleHttpErrors)
        document.getElementById("event-id").value = response.id
        document.getElementById("event-title").value = response.title
        document.getElementById("event-description").value = response.description
        document.getElementById("event-date").value = response.dateTime
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

async function updateEvent(){
    const token = localStorage.getItem("token")
    const id = document.getElementById("event-id").value
    const title = document.getElementById("event-title").value
    const description = document.getElementById("event-description").value
    const dato = document.getElementById("event-date").value.replace("T", " ")
    try{
    const response = await fetch(URL + id,{
        method:'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token},
        body:JSON.stringify({title,description,dato})})
        .then(handleHttpErrors)
    
        getEvents()

        document.getElementById("message-modal").style.color = "green"
        document.getElementById("message-modal")

    }catch(err){
        document.getElementById("message-modal").style.color = "red"
        document.getElementById("message-modal").innerText = err.message
    }
}

function choiceButton(evt){
    const targetId = evt.target.id
    const idSplit = targetId.split("-")
    if(idSplit[0] === "btn"){
        const id = idSplit[2]
        if(idSplit[1] === "remove"){
            deleteEvent(id)
        }
        else if(idSplit[1] === "openmodal"){
            modalSetup(id)
        }
    }
}

async function deleteEvent(id){
        const token = localStorage.getItem("token")
        try{
            const response = await fetch(URL+id,{
                method:'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }}).then(handleHttpErrors)
            
            getEvents()
            
        }catch(err){
            document.getElementById("error-text").innerText = err.message
        }
}