//display at top ------------------------------------------------------------------------------------------------------------------------
const displayStarElements = document.querySelectorAll(".displayStar");
const starArray = Array.from(displayStarElements).map(
  (element) => element.textContent
);

//data Entered----------------------------------------------------------------------------------------------------------------------------
const personName = document.getElementById("name");
const rating = document.getElementById("rating");

//buttons---------------------------------------------------------------------------------------------------------------------------------
const submitButton = document.querySelector("button[type=submit]");
const ratingList = document.getElementById("allRatings");

let deleteButton = document.createElement("button");
deleteButton.setAttribute("id", "deletebtn");
deleteButton.textContent = "Delete";

let editButton = document.createElement("button");
editButton.setAttribute("id", "editbtn");
editButton.textContent = "Edit";

//functions-------------------------------------------------------------------------------------------------------------------------------

//pre-fetched data------------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get("https://crudcrud.com/api/9ccc742a0bef465c98da05cddb6ec2c0/star")
    .then((result) => {
      console.log(result);
      for (let i = 0; i < result.data.length; i++) {
        displayRating(result.data[i]);
        increamentStar(result.data[i]);
      }
      console.log(starArray);
    })
    .catch((err) => {
      console.log(err);
    });
});

//submit funtionality----------------------------------------------------------------------------
submitButton.addEventListener("click", submitLi);

function submitLi(event) {
  event.preventDefault();
  let user = personName.value.trim();
  let rate = rating.value;

  if (user !== "") {
    const obj = {
      Name: user,
      Rating: rate,
    };
    console.log(obj);

    createRating(obj);
  } else {
    alert("Enter Name");
  }
}

//create rating--------------------------------------------------------------------------------------
function createRating(obj) {
  axios
    .post("https://crudcrud.com/api/9ccc742a0bef465c98da05cddb6ec2c0/star", obj)
    .then((result) => {
      console.log(result);
      displayRating(result.data);
      increamentStar(result.data);
      personName.value = "";
      rating.value = "1";
    })
    .catch((err) => {
      console.log(err);
    });
}

//display as li and update star UI----------------------------------------------------------------------
function displayRating(obj) {
  const deletebtn = deleteButton.cloneNode(true);
  deletebtn.addEventListener("click", () => deleteLi(obj, li));
  const editbtn = editButton.cloneNode(true);
  editbtn.addEventListener("click", () => editLi(obj, li));

  const li = document.createElement("li");
  li.textContent = `${obj.Name} - ${obj.Rating}`;
  li.appendChild(deletebtn);
  li.appendChild(editbtn);

  ratingList.appendChild(li);
}

//delete li------------------------------------------------------------------------------------------------
function deleteLi(obj, li) {
  axios
    .delete(
      `https://crudcrud.com/api/9ccc742a0bef465c98da05cddb6ec2c0/star/${obj._id}`
    )
    .then((result) => {
      console.log(result);
      ratingList.removeChild(li);
      decrementStar(obj);
      alert("deleted");
    })
    .catch((err) => {
      console.log(err);
    });
}

//edit funtionality-------------------------------------------------------------------------------------------
function editLi(obj, li) {
  let user = personName.value.trim();
  let rate = rating.value;

  if (user !== "") {
    const updatedObj = {
      Name: user,
      Rating: rate,
    };
    console.log(updatedObj);

    axios
      .put(
        `https://crudcrud.com/api/9ccc742a0bef465c98da05cddb6ec2c0/star/${obj._id}`,
        updatedObj
      )
      .then((result) => {
        console.log(result);
        ratingList.removeChild(li);
        axios
          .get(
            `https://crudcrud.com/api/9ccc742a0bef465c98da05cddb6ec2c0/star/${obj._id}`
          )
          .then((result) => {
            displayRating(result.data);
          })
          .catch((err) => console.log(err));
        decrementStar(obj);
        increamentStar(updatedObj);
        alert("Rating updated");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    alert("fill the name and select rating to update");
  }
}

//increament star-----------------------------------------------------------------------------------------------
function increamentStar(obj) {
  const ratingIndex = obj.Rating - 1;
  starArray[ratingIndex] = String(Number(starArray[ratingIndex]) + 1);
  displayStarElements[ratingIndex].textContent = starArray[ratingIndex];
}

//decrement star-----------------------------------------------------------------------------------------------
function decrementStar(obj) {
  const ratingIndex = obj.Rating - 1;
  starArray[ratingIndex] = String(Number(starArray[ratingIndex]) - 1);
  displayStarElements[ratingIndex].textContent = starArray[ratingIndex];
}
