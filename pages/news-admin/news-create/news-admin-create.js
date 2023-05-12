import { handleHttpErrors,sanitizeStringWithTableRows } from "../../../utils.js"
import { API_URL} from "../../../settings.js"

let URL = API_URL + "/news/"

export async function initCreateNews(){
    document.getElementById("btn-create-news").onclick = evt => createNews()
    document.getElementById("tbody").onclick = evt => chooseEvent(evt)
    document.getElementById("btn-open-modal").onclick = evt => getEventsForModal()
}

async function createNews(){
    const formData = new FormData()

    const fileInput = document.getElementById("news-image");

    formData.append('image',fileInput.files[0])

    
    const headline = document.getElementById("news-headline").value
    const textField = document.getElementById("news-textField").value
    const eventId = document.getElementById("news-event").value
    
    formData.append('headline', JSON.stringify(headline))
    formData.append('textField', JSON.stringify(textField))
    formData.append('event', JSON.stringify(eventId))
    
    try{
        const token = localStorage.getItem("token")
        const response = await fetch(URL,{
            method:'POST',
            headers: { 
                //'Authorization': 'Bearer ' + token
                }, 
            body: formData
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