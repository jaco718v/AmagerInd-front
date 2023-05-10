import { handleHttpErrors,sanitizeStringWithTableRows } from "../../utils.js"
import { API_URL} from "../../settings.js"

let URL = API_URL + "/events/"

export async function initCreateEvent(){
    document.getElementById("btn-create-event").onclick = evt => createEvent()
}

async function createEvent(){
    const formData = new FormData()

    const fileInput = document.getElementById("event-image");

    formData.append('image',fileInput.files[0])

    
    const title = document.getElementById("event-title").value
    const description = document.getElementById("event-description").value
    const dateTime = document.getElementById("event-date").value.replace("T", " ")


    formData.append('title', JSON.stringify(title))
    formData.append('description', JSON.stringify(description))
    formData.append('dateTime', (JSON.stringify(dateTime)))


    try{
        const token = localStorage.getItem("token")
        const response = await fetch(URL,{
            method:'POST', 
            body: formData
        })
                //'Authorization': 'Bearer ' + token},})
            .then(handleHttpErrors)
        
        window.router.navigate("/event/update")
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }

}