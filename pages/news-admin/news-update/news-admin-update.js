import { convertBase64, handleHttpErrors,sanitizeStringWithTableRows} from "../../../utils.js"
import { API_URL} from "../../../settings.js"
import { paginator } from "../../../lib/paginator/paginate-bootstrap.js"

let URL = API_URL + "/news/"

//let newsItems
const SIZE = 5
let sortOrder = "desc"
let sortField = "id"
const navigoRoute = "news/update"

export async function initUpdateNews(pg,match) {
  getNews(pg, match)
  document.getElementById("theader").onclick = evt => handleSort(pg, match, evt)
  document.getElementById("tbody").onclick = evt => choiceButton(evt, pg, match)
  document.getElementById("btn-create-news").onclick = evt => updateNews(pg, match)

}

async function handleSort(pageNo, match, evt) {
  const targetId = evt.target.id
  const idSplit = targetId.split("-")
  
  if(idSplit[0] === "sort"){
      sortOrder = sortOrder == "asc" ? "desc" : "asc"
      sortField = idSplit[1]
      await getNews(pageNo, match)
  }
}

/*
async function fetchNews() {
  try {
    const response = await fetch(URL).then(handleHttpErrors)
    renderNews(response);
  } catch (error) {
    console.error("Error fetching news:", error)
  }
}



function renderNews(newsItems) {
  const newsContainer = document.getElementById("news-container")

  newsItems.forEach(news => {
    const title = document.createElement("h2")
    title.innerText = news.img;
    newsContainer.appendChild(title)
    
  });
}
*/

async function getNews(pg, match){
  const TOTAL = await getNewsTotal()

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
      document.getElementById("error-text").innerText = err.message
  }

  paginator({
      target: document.getElementById("news-paginator"),
      total: TOTAL,
      current: pageNo,
      click: getNews
    })

    window.router?.navigate(`/${navigoRoute}${navigoRef}`, { callHandler: false, updateBrowserURL: true })
}


function makeTableRow(news){
  const newsRowString = 
  `<tr>
  <td> <img class="event-img" src="data:image/jpeg;base64,${news.encodedImage}" alt="Intet" style:></td>
  <td>${news.id}</td>
  <td>${news.headline}</td>
  <td>
  <button id="btn-openmodal-${news.id}" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#news-modal">Editer</button>
  <button id="btn-remove-${news.id}" type="button" class="btn btn-warning">Slet</button>
  </td>
  </tr>` 
  return newsRowString
}

async function getNewsTotal(){
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

async function modalSetup(id){
  try{
      const response = await fetch(URL+id)
      .then(handleHttpErrors)
      document.getElementById("news-id").value = response.id
      document.getElementById("news-headline").value = response.headline
      document.getElementById("news-textField").value = response.textField
      document.getElementById("news-image").value = null
      
     
      try{
          let child = document.getElementById("child-img")
          document.getElementById("news-display-image").removeChild(child)
      }catch(err){}
  
      let img = document.createElement("img")
      img.setAttribute("id","child-img")
      img.setAttribute("alt", "No image found")


      let imageBase64 = response.encodedImage
      img.src = "data:image/jpeg;base64,"+imageBase64
      
      document.getElementById("news-display-image").append(img)

  }catch(err){
      document.getElementById("error-text").innerText = err.message
  }
}

async function updateNews(pg, match){
  const token = localStorage.getItem("token")
  const id = document.getElementById("news-id").value
  
  const fileInput = document.getElementById("news-image").files[0];
  
  let encodedImage = null

  if(fileInput != null){
  encodedImage = await convertBase64(fileInput)
  encodedImage = encodedImage.replace("data:", "")
  .replace(/^.+,/, "")
  }

  

  const headline = document.getElementById("news-headline").value
  const textField = document.getElementById("news-textField").value
  

  try{
  const response = await fetch(URL + id,{
      method:'PUT',
      headers: { 
        'Content-Type': 'application/json'
          //'Authorization': 'Bearer ' + token
          },
          
      body:JSON.stringify({encodedImage,headline,textField})})
      .then(handleHttpErrors)
  
      getNews(pg, match)
      
      var modalId = document.getElementById("news-modal")
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
          deleteNews(id, pg, match)
      }
      else if(idSplit[1] === "openmodal"){
          modalSetup(id)
      }
  }
}

async function deleteNews(id,pg, match){
      const token = localStorage.getItem("token")
      try{
          const response = await fetch(URL+id,{
              method:'DELETE',
              headers: {
                 // 'Authorization': 'Bearer ' + token
              }})
          
          getNews(pg, match)
          
      }catch(err){
          document.getElementById("error-text").innerText = err.message
      }
}


