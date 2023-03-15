import "./style.css";

const options = {
  per_page: 10,
};

type JSONResponse = {
  total_count: number;
};

document.addEventListener("click", handleClick);

// ====================== Functions ==========================

function handleClick(e: Event) {
  const target = <HTMLButtonElement>e.target;

  if (target.closest(".search__submit")) {
    const inputQuery = <HTMLFormElement>target.previousElementSibling;
    const queryString = inputQuery.value;
    const url = getUrl(queryString, options);
    getAndShow(url);
    
  }
}

async function getAndShow(url: string) {
  const fetchedData = await fetchData<JSONResponse>(url);
  outputList(fetchedData);
}

async function fetchData<T>(url: string): Promise<T> {
  let response = await fetch(url);
  return await response.json();
}

function outputList(data: JSONResponse) {
  const { total_count } = data;

  const output = <HTMLElement>document.querySelector(".search__output");
  output.innerHTML = `${total_count}`;
}

type optionsProp = {
  per_page: number;
};

function getUrl(str: string, options: optionsProp) {
  const { per_page } = validate(options);

  let url = `https://api.github.com/search/repositories?q=${str}&per_page=${per_page}`;

  return url;
}

function validate(data: optionsProp) {
  const { per_page } = data;

  const result = {
    per_page: 30,
    message: { per_page: "" },
  };

  if (per_page > 100) {
    result.per_page = 100;
    result.message.per_page =
      "Количество результатов на страницу не может превышать 100";
  }

  return result;
}
