import "./style.css";

document.addEventListener("click", handleClick);

// ====================== Functions ==========================

function handleClick(e: Event) {
  const target = <HTMLButtonElement>e.target;

  if (target.closest(".search__submit")) {
    const inputQuery = <HTMLFormElement>target.previousElementSibling;

    const queryString = inputQuery.value;

    console.log(queryString);
    fetchData();
  }
}

async function fetchData() {
  let url = `https://api.github.com/search/repositories?q=toxin`;

  let response = await fetch(url);
  
  let fetchedData = await response.json();
  console.log(fetchedData);
}
