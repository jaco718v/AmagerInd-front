import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";
import { API_URL } from "../../settings.js";

let URL = API_URL+"/vinyl/"

export async function initAllVinyls(){
    await getAllVinyls()
    document.getElementById("tbody").onclick = evt => goToEvent(evt)
    document.getElementById("btn-edit-vinyl").onclick = editVinyl
    document.getElementById("btn-add-vinyl").onclick = displayAddVinyl
    document.getElementById("btn-add-new-vinyl").onclick = addVinyl
}

async function getAllVinyls() {
    await fetch(URL)
        .then(response => response.json())
        .then(data => makeTable(data))
}

function makeTable(vinyls) {
    const tableRows = vinyls.map(vinyl =>
        `<tr>
        <td>${vinyl.image}</td>
        <td>${vinyl.artist}</td>
        <td>${vinyl.title}</td>
        <td>${vinyl.year}</td>
        <td>${vinyl.country}</td>
        <td>${vinyl.genre}</td>
        <td>${vinyl.label}</td>
        <td>${vinyl.price}</td>
        <td>
        <button id="btn-edit-vinyl-${vinyl.id}" type="button" class="btn btn-primary">Opdatér</button>
        <button id="btn-delete-vinyl-${vinyl.id}" type="button" class="btn btn-secondary">Slet</button>
        </td>
    </tr>`).join('')
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(tableRows)

    vinyls.forEach((vinyl) => {
        document.getElementById(`btn-delete-vinyl-${vinyl.id}`).addEventListener("click", () => deleteVinyl(vinyl.id));
    })
}

function goToEvent(evt) {
    const target = evt.target
    const targetId = target.id
    const targetIdSplit = targetId.split("-")
    const vinylID = targetIdSplit[3]
    if(targetIdSplit[1]=='edit'){
        updateVinyl(vinylID)
    }
    if(targetIdSplit[1]=='delete'){
        deleteVinyl(vinylID)
    }
}

async function deleteVinyl(vinylID) {
    const options = {method: 'DELETE'}

    try {
        await fetch(URL+vinylID, options)
        document.getElementById("succes").innerText = "Vinyl with ID: " + vinylID + " is now deleted"
        document.getElementById("error").innerText = ""
    } catch (err) {
        document.getElementById("error").innerText = err.message
        document.getElementById("succes").innerText = ""
    }
}

async function updateVinyl(vinylID) {
    document.getElementById("update-vinyl").style.display = "block"

    try {
        await fetch(URL + vinylID)
            .then(response => response.json())
            .then(data => setPlaceholders(data))
    } catch (err) {
        console.log(err.message)
    }
}

function setPlaceholders(vinyl) {
    document.getElementById("ID").value = vinyl.id
    document.getElementById("ID").style.display = "none"
    document.getElementById("artist").placeholder = vinyl.artist
    document.getElementById("title").placeholder = vinyl.title
    document.getElementById("image").placeholder = vinyl.image
    document.getElementById("year").placeholder = vinyl.year
    document.getElementById("country").placeholder = vinyl.country
    document.getElementById("genre").placeholder = vinyl.genre
    document.getElementById("label").placeholder = vinyl.label
    document.getElementById("price").placeholder = vinyl.price
}

async function editVinyl() {
    const id = document.getElementById(("ID")).value
    const artist = document.getElementById("artist").value
    const title = document.getElementById("title").value
    const image = document.getElementById("image").value
    const year = document.getElementById("year").value
    const country = document.getElementById("country").value
    const genre = document.getElementById("genre").value
    const label = document.getElementById("label").value
    const price = document.getElementById("price").value

    const data = {"artist":artist, "title":title, "image":image,  "year":year, "country":country, "genre":genre, "label":label, "price":price};

    const options = {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}

    try {
        await fetch(URL + id, options)
        document.getElementById("update-vinyl").style.display = "none"
    } catch (err) {
        console.log(err)
    }
}

function displayAddVinyl() {
    document.getElementById("add-vinyl").style.display = "block"
    document.getElementById("btn-add-vinyl").style.display = "none"
}

async function addVinyl() {
    const artist = document.getElementById("add-artist").value
    const title = document.getElementById("add-title").value
    const image = document.getElementById("add-image").value
    const year = document.getElementById("add-year").value
    const country = document.getElementById("add-country").value
    const genre = document.getElementById("add-genre").value
    const label = document.getElementById("add-label").value
    const price = document.getElementById("add-price").value

    const data = {"artist":artist, "title":title, "image":image,  "year":year, "country":country, "genre":genre, "label":label, "price":price};

    const options = {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}

    try {
        await fetch(URL, options)
            .then(response => response.json())
            .then(data => setPlaceholders(data))
        document.getElementById("succes").innerText = "New vinyl added to list"
        document.getElementById("add-vinyl").style.display = "none"
        document.getElementById("btn-add-vinyl").style.display = "block"
    } catch (err) {
        console.log(err)
    }
}




