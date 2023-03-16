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
  stargazers_count: number;
};

type JSONResponse = {
  total_count: number;
  items: Repo[];
};

document.addEventListener("click", handleClick);
document.addEventListener("keydown", handleKeydown);

// ====================== Functions ==========================

function handleClick(e: Event) {
  const target = <HTMLButtonElement>e.target;
  const form = <HTMLFormElement>target.closest("form");

  if (target.closest(".search__submit")) {
    if (!checkForm(form)) return;
    const query = getInputValue(target, "query");
    const url = getUrl(query, options);
    fetchAndShow(url);
  }
}

function handleKeydown(e: any) {
  const ev = e as KeyboardEvent;
  const target = e.target;

  if (ev.code == "Enter" && !ev.shiftKey) {
    if (target.closest(".search__form")) {
      const form = <HTMLFormElement>target.closest("form");
      const submit = <HTMLFormElement>form.querySelector(".search__submit");

      if (!e.repeat) {
        const newEvent = new Event("click", {
          bubbles: true,
          cancelable: true,
        });
        submit.dispatchEvent(newEvent);
        e.preventDefault();

        if (checkForm(form)) {
          const query = getInputValue(target, "query");
          const url = getUrl(query, options);
          fetchAndShow(url);
        }
      }
    }
  }
}

function checkForm(form: HTMLFormElement) {
  const { query } = form;

  let isInputQuery = true;

  if (query.value.length < 3) {
    query.value = "";
    query.placeholder = "Недостаточно символов!";
    query.style.setProperty("--placeholder-color", "red");
    isInputQuery = false;
  }

  return isInputQuery;
}

function getInputValue(target: HTMLButtonElement, inputName: string): string {
  const form = <HTMLFormElement>target.closest("form");
  const input = <HTMLFormElement>(
    form.querySelector(`input[name='${inputName}']`)
  );
  return input.value;
}

async function fetchAndShow(url: string) {
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

  if (!total_count) {
    output.innerHTML = `<div>Ничего не найдено</div>`;
    return;
  }

  const start = `
  <div class="total-count"><span>Найдено ${total_count} репозиториев</span></div>
  <table>
  <thead>
    <tr>
      <th title="Имя репозитория">Репозиторий</th>
      <th title="Количество звезд">Звезды</th>
      <th title="Язык программирования">Язык</th>
      <th title="Описание репозитория">Описание</th>
      <th title="Дата последнего обновления">Обновлено</th>
    </tr>
  </thead>
  <tbody>
  `;

  let iterable = "";
  let end = "";

  for (let item of items) {
    let {
      name,
      html_url,
      description,
      updated_at,
      language,
      stargazers_count,
    } = item;

    if (description && description.length > 200) {
      description = description.slice(0, 200);
    }

    const updated = formatDate(updated_at);

    iterable += `
      <tr>
          <td><a title="Имя репозитория" target="_blank" href="${html_url}">${name}</a></td>
          <td>${stargazers_count}</td>
          <td>${language}</td>
          <td>${description}</td>
          <td>${updated}</td>
      </tr>
    `;

    end = `
    </tbody>
    </table>
    `;
  }

  output.innerHTML = start + iterable + end;
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
