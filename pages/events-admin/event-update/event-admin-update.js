import { convertBase64, handleHttpErrors,sanitizeStringWithTableRows } from "../../../utils.js"
import { API_URL} from "../../../settings.js"
import { paginator } from "../../../lib/paginator/paginate-bootstrap.js"
const SIZE = 5
let sortOrder = "desc"
let sortField = "id"
const navigoRoute = "event/update"


let URL = API_URL + "/events/"

export async function initUpdateEvent(pg, match){
    getEvents(pg, match)
    document.getElementById("theader").onclick = evt => handleSort(pg, match, evt)
    document.getElementById("tbody").onclick = evt => choiceButton(evt, pg, match)
    document.getElementById("btn-create-event").onclick = evt => updateEvent(pg, match)

}

async function handleSort(pageNo, match, evt) {
    const targetId = evt.target.id
    const idSplit = targetId.split("-")
    
    if(idSplit[0] === "sort"){
        sortOrder = sortOrder == "asc" ? "desc" : "asc"
        sortField = idSplit[1]
        await getEvents(pageNo, match)
    }
  }

async function getEvents(pg, match){
    const TOTAL = await getEventsTotal()
    
    const p = match?.params?.page || pg 
    let pageNo = Number(p)
    let queryString =  `?sort=${sortField},${sortOrder}&size=${SIZE}&page=` + (pageNo-1)
    let navigoRef = `?page=` + (pageNo)
    

    try{
    const response = await fetch(URL+queryString)
    .then(handleHttpErrors)

    const tableRows = response.map(makeTableRow).join("")

    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(tableRows)

    

    }catch(err){
        document.getElementById("message-modal").innerText = err.message
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
    <td>${storeEvents.dateTime}</td>
    <td>${storeEvents.created}</td>
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
        document.getElementById("event-image").value = null
        
       
        try{
            let child = document.getElementById("child-img")
            document.getElementById("event-display-image").removeChild(child)
        }catch(err){}
    
        let img = document.createElement("img")
        img.setAttribute("id","child-img")
        img.setAttribute("alt", "No image found")


        let imageBase64 = response.encodedImage
        img.src = "data:image/jpeg;base64,"+imageBase64
        
        document.getElementById("event-display-image").append(img)

    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}

async function updateEvent(pg, match){
    const token = localStorage.getItem("token")
    const id = document.getElementById("event-id").value

    const fileInput = document.getElementById("event-image").files[0];
  
    let encodedImage = null

    if(fileInput != null){
    encodedImage = await convertBase64(fileInput)
    encodedImage = encodedImage.replace("data:", "")
    .replace(/^.+,/, "")
    }

    
    const title = document.getElementById("event-title").value
    const description = document.getElementById("event-description").value
    const dateTime = document.getElementById("event-date").value.replace("T", " ")

    try{
    const response = await fetch(URL + id,{
        method:'PUT',
        headers: { 
            'Content-Type': 'application/json'
            //'Authorization': 'Bearer ' + token
            },
            
        body:JSON.stringify({title,description,dateTime,encodedImage})})
        .then(handleHttpErrors)
    
        getEvents(pg, match)
        
        var modalId = document.getElementById("event-modal")
        var modal = bootstrap.Modal.getInstance(modalId)
        modal.hide()
        
    }catch(err){
        document.getElementById("message-modal").style.color = "red"
        document.getElementById("message-modal").innerText = err.message
    }
}

function choiceButton(evt, pg, match){
    const targetId = evt.target.id
    const idSplit = targetId.split("-")
    if(idSplit[0] === "btn"){
        const id = idSplit[2]
        if(idSplit[1] === "remove"){
            deleteEvent(id, pg, match)
        }
        else if(idSplit[1] === "openmodal"){
            modalSetup(id)
        }
    }
}

async function deleteEvent(id, pg, match){
        const token = localStorage.getItem("token")
        try{
            const response = await fetch(URL+id,{
                method:'DELETE',
                headers: {
                    //'Authorization': 'Bearer ' + token
                }})
            
            getEvents(pg, match)
            
        }catch(err){
            document.getElementById("error-text").innerText = err.message
        }
}