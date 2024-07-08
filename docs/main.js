let newBtn = document.getElementById("menu-new")
let modal = document.getElementById("myModal")
let username
let entryLists = document.getElementById("entryLists")

newBtn.addEventListener("click", () => {
  //pop up new page
  modal.style.display = "block"
})

//modal page's close button
let span = document.getElementsByClassName("close")[0]
span.onclick = function () {
  modal.style.display = "none"
}

//submit button
let submitBtn = document.getElementById("submitBtn")

submitBtn.onclick = function () {
  let inputValue = document.getElementById("contentInput").value
  let nameInput = document.getElementById("nameInput").value
  // Check if there's an uploaded file
  let files = imageUpload.files

  if (files.length > 0) {
    uploadEntry(inputValue, nameInput, files)
  } else {
    // If there's no file, create the entry without an image
    uploadEntry(inputValue, nameInput, null)
  }
  modal.style.display = "none"
}

let saveBtn = document.getElementById("menu-save")
saveBtn.addEventListener("click", () => {
  downloadDiaries()
})

function downloadDiaries() {
  var opt = {
    margin: 1,
    filename: "MyDiary.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  }
  // Use html2pdf to convert the entire body or a specific element to PDF
  // Here, `document.body` can be replaced with the specific element you want to convert
  html2pdf().set(opt).from(document.body).save()
}

//upload image

var imageUpload = document.getElementById("imageUpload")
// Listen for when an image is selected
imageUpload.onchange = function (event) {
  var files = event.target.files
  if (files.length > 0) {
    var file = files[0]

    // Optionally, handle the file. For example, to display a preview:
    var reader = new FileReader()
    reader.onload = function (e) {
      // Create an image element
      var img = document.createElement("img")

      img.src = e.target.result
      img.style.maxWidth = "90%" // Ensure the image is not too large
      img.style.marginTop = "10px"

      var container = document.querySelector(".modal-content")
      var existingPreview = container.querySelector("img")
      if (existingPreview) {
        container.replaceChild(img, existingPreview)
      } else {
        container.appendChild(img)
      }
    }

    reader.readAsDataURL(file)
  }
}

// get the data from the server append a new entry to the main page
function uploadEntry(text, _name, image, date) {
  let formData = new FormData()

  if (image) {
    formData.append("image-upload", image[0])
  }

  formData.append("text", text)
  formData.append("_name", _name)
  formData.append("date", new Date().toISOString())

  fetch("/api/uploadImage", {
    method: "POST",
    body: formData,
  }).then((response) => {
    if (response.ok) {
      getPost()
      console.log("Upload successful")
    } else {
      console.error("Upload failed")
    }
  })
}
function getPost() {
  let formData = new FormData()

  fetch("/api/listPost", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json()
    })
    .then((response) => {
      // if (response.ok) {
      console.log("Get post successful")
      let entries = response || []
      console.log(response)
      entryLists.innerHTML = ""
      entries.forEach((entry) => {
        createEntry(entry.text, entry._name, entry.url, entry.date)
      })
    })
}
function createEntry(text, _name, imageData, date) {
  let entryContainer = document.createElement("div")
  entryContainer.className = "entry"

  let dateDiv = document.createElement("div")
  dateDiv.className = "date"
  dateDiv.textContent = moment(date).tz("America/New_York").format("LLL")

  let textDiv = document.createElement("div")
  textDiv.className = "text"
  textDiv.textContent = text

  textDiv.style.display = "block"

  let nameDiv = document.createElement("div")
  nameDiv.className = "name"
  nameDiv.textContent = _name
  nameDiv.style.display = "block"

  entryContainer.appendChild(nameDiv)
  entryContainer.appendChild(dateDiv)
  entryContainer.appendChild(textDiv)

  let img
  if (imageData) {
    img = document.createElement("img")
    img.src = imageData
    img.style.marginTop = "10px"
    img.classList.add("images")
    entryContainer.appendChild(img)
  }

  let toggleButton = document.createElement("button")
  toggleButton.className = "toggleBtn"
  toggleButton.textContent = "Fold"
  toggleButton.onclick = function () {
    if (
      textDiv.style.display === "block" ||
      dateDiv.style.display === "block"
    ) {
      textDiv.style.display = "none"
      dateDiv.style.display = "none"
      toggleButton.textContent = "Expand"
      if (img != null) {
        img.style.display = "none"
      }
    } else {
      textDiv.style.display = "block"
      dateDiv.style.display = "block"
      if (img != null) {
        img.style.display = "block"
      }
      toggleButton.textContent = "Fold"
    }
  }
  entryContainer.appendChild(toggleButton)

  entryLists.appendChild(entryContainer)
}

// --users adding their id--
window.addEventListener("load", () => {
  const validUsername = /^[a-zA-Z0-9]+$/.test(username)
  if (!validUsername) {
    //alert("Invalid username. Only letters and numbers are allowed.");
    return
  }

  getPost()
})
