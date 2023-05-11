import {handleHttpErrors} from "../../utils.js"
import {API_URL} from "../../settings.js"

let URL = API_URL + "/news/"

//let newsItems


export async function initNews() {
  fetchNews() 

}

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


