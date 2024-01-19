//initail function to call getting data
function getData(perPage = 10) {
  const userName = document.getElementById("searchBar").value;
  if (userName === "") {
    const reposContainer = document.getElementById("repos-conatiner");
    reposContainer.innerHTML = "<h1>UserName Cannot Be Empty</h1>";
    return;
  }
  const pageNo = document.getElementById("pagination-value").value;

  getRepo(userName, pageNo, perPage);
  getProfile(userName);
}

//function for navigating previous page
function prevPage() {
  const userName = document.getElementById("searchBar").value;
  const pageNo = document.getElementById("pagination-value");
  const reposPerPage = document.getElementsByTagName("select")[0].value;
  if (pageNo.value > 1) {
    getRepo(userName, +pageNo.value - 1, reposPerPage);
    document.getElementById("next-button").disabled = false;
    pageNo.value = +pageNo.value - 1;
  } else {
    return;
  }
}

//function for navigating next page

function nextPage() {
  const userName = document.getElementById("searchBar").value;
  const pageNo = document.getElementById("pagination-value");

  const reposPerPage = document.getElementsByTagName("select")[0].value;

  getRepo(userName, +pageNo.value + 1, reposPerPage);

  pageNo.value = +pageNo.value + 1;
}
//function for getting profile details

async function getProfile(userName) {
  let profileData = await fetch(`https://api.github.com/users/${userName}`);

  profileData = await profileData.json();
  updateProfileData(profileData);
}

function updateProfileData(profileData) {
  const profileContainer = document.getElementById("profile");
  profileContainer.innerHTML = null;

  profileContainer.innerHTML = `<div class="imageSection">
    <img src="${profileData.avatar_url}" />
    <a href="${profileData.html_url}">
      &#x1F517;${profileData.html_url}</a
    >
  </div>
  <div class="profile-details">
    <h2>${profileData.name}</h2>
    <h4>${!profileData.bio ? "No Bio Found" : profileData.bio}</h4>
    <h6>&#x1F4CD;${
      profileData.location ? profileData.location : "No Location Found"
    }</h6>
    <a href="https://twitter.com/${
      profileData.twitter_username ? profileData.twitter_username : "#"
    }">${
    profileData.twitter_username ? "Twitter" : "No Twitter Username Found"
  }</a>

  </div>`;
}

//function getting repositoires data from the api

async function getRepo(userName, pageNo, perPage) {
  const reposContainer = document.getElementById("repos-conatiner");

  if (!userName || userName === "") {
    reposContainer.innerHTML = "<h1>Username Cannot be empty</h1>";
    return;
  }
  reposContainer.innerHTML = "<h1>Loading ......</h1>";
  let data = [];
  await fetch(
    `https://api.github.com/users/${userName}/repos?page=${pageNo}&per_page=${perPage}`
  )
    .then((response) => {
      if (response.status === 404) {
        reposContainer.innerHTML = "<h1>No User Found</h1>";
        return;
      }
      response.json().then((jsonResponse) => {
        addingEle(jsonResponse);
      });
    })
    .catch((err) => {
      reposContainer.innerHTML = "<h1>Something Went Wrong</h1>";
    });
}

//function for updating elements to the div container

function addingEle(data) {
  const reposContainer = document.getElementById("repos-conatiner");

  reposContainer.innerHTML = null;
  if (!data || data.length === 0) {
    reposContainer.innerHTML = "<h1>No Repositories Found</h1>";
    document.getElementById("next-button").disabled = true;
    return;
  }

  data.map((ele) => {
    const childNode = document.createElement("div");
    childNode.innerHTML = `<div class="repo">
    <h1 class="repo-name">${ele.name}</h1>
    <p>${ele.description ? ele.description : "No Description Found"}</p>
    <div id="tags-container">
    ${
      ele?.topics?.length === 0
        ? `<div class=${"tag"}>No Topics</div>`
        : topicsJoiner(ele.topics)
    }
    </div>
  </div>`;
    reposContainer.appendChild(childNode);
  });

  const buttonContainer = document.getElementById("buttons-container");
  buttonContainer.style.display = "flex";
}

//function for joining the topics as a string and appending into htnml

function topicsJoiner(topics) {
  const htmlTopics = topics.map((ele) => {
    return `<div class=${"tag"}>${ele}</div>`;
  });

  return htmlTopics.join(" ");
}
