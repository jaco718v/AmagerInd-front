import { convertBase64, handleHttpErrors,sanitizeStringWithTableRows } from "../../../utils.js"
import { API_URL} from "../../../settings.js"

let URL = API_URL + "/events/"

export async function initCreateEvent(){
    document.getElementById("btn-create-event").onclick = evt => createEvent()
}

async function createEvent(){
    const token = localStorage.getItem("token")

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
        const response = await fetch(URL,{
            method:'POST',
            headers: { 
                'Content-Type': 'application/json'
                //'Authorization': 'Bearer ' + token
                }, 
            body: JSON.stringify({title,description,dateTime, encodedImage})
        })
            .then(handleHttpErrors)
        
        window.router.navigate("/event/update")
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }

}