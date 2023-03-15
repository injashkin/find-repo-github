import "./style.css";

const options = {
  per_page: 10,
};

type Repo = {
  name: string;
  html_url: string;
  description: string;
  updated_at: string;
  language: string;
};

type JSONResponse = {
  total_count: number;
  items: Repo[];
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

function formatDate(date: string) {
  return date.slice(0, 10).split("-").reverse().join("-");
}

function outputList(data: JSONResponse) {
  const { total_count, items } = data;

  const output = <HTMLElement>document.querySelector(".search__output");

  output.innerHTML = `
  <div><span>Найдено ${total_count} репозиториев</span></div>
  <ol>
  `;

  for (let item of items) {
    const { name, html_url, description, updated_at, language } = item;

    const updated = formatDate(updated_at);

    output.innerHTML += `
    <li>
      <a title="Имя репозитория" href="${html_url}">${name}</a>
      <span title="Язык программирования" class="search__lang">${language}</span>
      <span title="Дата последнего обновления" class="search__date">${updated}</span>
      <span title="Описания репозитория">${description}</span>
    </li>
    `;
  }

  output.innerHTML += `
  </ol>
  `;
}

type optionsProp = {
  per_page: number;
};

function getUrl(str: string, options: optionsProp) {
  const { per_page } = validate(options);

  let url = `https://api.github.com/search/repositories?q=${str}&per_page=10`;

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
