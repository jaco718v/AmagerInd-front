import { convertBase64, handleHttpErrors,sanitizeStringWithTableRows } from "../../../utils.js"
import { API_URL} from "../../../settings.js"

let URL = API_URL + "/news/"

export async function initCreateNews(){
    document.getElementById("btn-create-news").onclick = evt => createNews()
    document.getElementById("tbody").onclick = evt => chooseEvent(evt)
    document.getElementById("btn-open-modal").onclick = evt => getEventsForModal()
}



async function createNews(){
    const token = localStorage.getItem("token")
  
    const fileInput = document.getElementById("news-image").files[0];
    
    let encodedImage = null

    if(fileInput != null){
    encodedImage = await convertBase64(fileInput)
    encodedImage = encodedImage.replace("data:", "")
    .replace(/^.+,/, "")
    }
  
    

    const headline = document.getElementById("news-headline").value
    const textField = document.getElementById("news-textField").value
    const eventId = document.getElementById("news-event").value
    const priority = document.getElementById("news-priority").value

    
    try{
        const response = await fetch(URL,{
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                }, 
            body: JSON.stringify({encodedImage,headline,textField,eventId,priority})
        })
            .then(handleHttpErrors)
        
        window.router.navigate("/news/update")
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }

}

function chooseEvent(evt){
    const target = evt.target
    const targetId = target.id
    const targetIdSplit = targetId.split("-")
    if(targetIdSplit[1]=== "choose"){
        document.getElementById("news-event").value = targetIdSplit[2]
        
        var modalId = document.getElementById("news-event-modal")
        var modal = bootstrap.Modal.getInstance(modalId)
        modal.hide()
    }
    
}


async function  getEventsForModal(){
    try{
        const response = await fetch(API_URL+"/events/short")
        .then(handleHttpErrors)

        const tableRows = response.map(makeTableRow).join("")

        document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(tableRows)


    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
}



function makeTableRow(event){
    const eventRowString = 
    `<tr>
    <td>${event.id}</td>
    <td>${event.title}</td>
    <td>${event.created}</td>
    <td>
    <button id="btn-choose-${event.id}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Vælg</button>
    </td>
    </tr>` 
    return eventRowString
}