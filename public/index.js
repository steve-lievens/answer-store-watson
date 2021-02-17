// initialize variables and display
const http = new XMLHttpRequest();
let responseData = [];
getAnswers();

// Input fields validation Function.
function validation() {
  return true;
}

// listen for and capture newly entered answer
function captureSubmit(event) {
  // log.textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
  let answerID = document.getElementById("answerID").value;
  let language = document.getElementById("language").value;
  let answerText = document.getElementById("answerText").value;

  let answerContent = {
    id: sanitize(answerID),
    language: sanitize(language),
    answerText: sanitize(answerText),
  };
  // clear Form values
  document.getElementById("answerID").value = "";
  document.getElementById("language").value = "";
  document.getElementById("answerText").value = "";
  addAnswer(answerContent);
  event.preventDefault();
}

const form = document.getElementById("answerForm");

form.addEventListener("submit", captureSubmit);

// get all answers stores from database
function getAnswers() {
  http.open("GET", location + "api/answers");
  http.onreadystatechange = function () {
    if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
      responseData = JSON.parse(http.responseText);
      responseData.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      updateResponseArea(responseData);
    } else if (http.readyState === XMLHttpRequest.DONE) {
      alert("An error occurred when getting answers from the database.");
    }
  };
  http.send();
}

// add new answer to database
function addAnswer(answer) {
  http.open("POST", location + "api/answers");
  http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  let timestamp = new Date().toISOString();
  let data =
    "id=" +
    answer.id +
    "&language=" +
    answer.language +
    "&answerText=" +
    answer.answerText +
    "&timestamp=" +
    timestamp;
  console.log(data);
  http.onreadystatechange = function () {
    if (http.readyState === XMLHttpRequest.DONE && http.status === 201) {
      getAnswers();
    } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 201) {
      alert("An error occurred when adding the answer to the database, because: " + http.response);
    }
  };
  http.send(data);
}

// update the response area with new data from database
function updateResponseArea(responseData) {
  let answers_table = document.querySelector("#responseContent");
  answers_table.innerHTML = "";
  let responseHead = document.querySelector("#responseHead");

  if (responseData.length === 0) {
    responseHead.textContent = "No items in database.";
  } else {
    createTable(
      responseData,
      ["display_id", "_id", "language", "answerText"],
      ["Answer ID", "Search Key", "Language", "Answer Text", "Delete"]
    );

    responseHead.textContent = "Database contents ";
  }
}

function createTable(objectArray, fields, fieldTitles) {
  let answers_table = document.querySelector("#responseContent");
  let tbl = document.createElement("table");
  tbl.setAttribute("id", "answers_table");
  let thead = document.createElement("thead");
  let thr = document.createElement("tr");
  fieldTitles.forEach((fieldTitle) => {
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(fieldTitle));
    thr.appendChild(th);
  });
  thead.appendChild(thr);
  tbl.appendChild(thead);

  let tbdy = document.createElement("tbody");
  let tr = document.createElement("tr");
  objectArray.forEach((object) => {
    console.log(object);
    let tr = document.createElement("tr");
    fields.forEach((field) => {
      var td = document.createElement("td");
      td.appendChild(document.createTextNode(sanitize(object[field])));
      tr.appendChild(td);
    });
    //Adding delete button
    var tdDelete = document.createElement("td");
    var aDeleteLink = document.createElement("a");

    aDeleteLink.setAttribute(
      "href",
      "javascript:deleteAnswer('" + object._id + "','" + object.rev + "')"
    );
    aDeleteLink.innerText = "🗑️";
    tdDelete.appendChild(aDeleteLink);
    tr.appendChild(tdDelete);
    tbdy.appendChild(tr);
  });
  tbl.appendChild(tbdy);
  answers_table.appendChild(tbl);
  return tbl;
}

function deleteAnswer(id, rev) {
  var result = confirm("Are you sure you want to delete?");

  if (result) {
    http.open("POST", location + "api/answers/delete");
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    let data = "id=" + id + "&rev=" + rev;
    console.log(data);
    http.onreadystatechange = function () {
      if (http.readyState === XMLHttpRequest.DONE && http.status === 201) {
        getAnswers();
      } else if (http.readyState === XMLHttpRequest.DONE && http.status !== 201) {
        // alert("Removing doc " + http.response);
        getAnswers();
      }
    };
    http.send(data);
  } else {
  }
}

// sanitize inputs/outputs to prevent xss
function sanitize(str) {
  return String(str)
    .replace(/&(?!amp;|lt;|gt;)/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
