(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const l={per_page:10};document.addEventListener("click",v);document.addEventListener("keydown",b);function v(e){const t=e.target,n=t.closest("form");if(t.closest(".search__submit")){if(!u(n))return;const s=f(t,"query"),r=p(s,l);d(r)}}function b(e){const t=e,n=e.target;if(t.code=="Enter"&&!t.shiftKey&&n.closest(".search__form")){const s=n.closest("form"),r=s.querySelector(".search__submit");if(!e.repeat){const o=new Event("click",{bubbles:!0,cancelable:!0});if(r.dispatchEvent(o),e.preventDefault(),u(s)){const c=f(n,"query"),a=p(c,l);d(a)}}}}function u(e){const{query:t}=e;let n=!0;return t.value.length<3&&(t.value="",t.placeholder="Недостаточно символов!",t.style.setProperty("--placeholder-color","red"),n=!1),n}function f(e,t){return e.closest("form").querySelector(`input[name='${t}']`).value}async function d(e){const t=await q(e);$(t)}async function q(e){return await(await fetch(e)).json()}function L(e){return e.slice(0,10).split("-").reverse().join("-")}function $(e){const{total_count:t,items:n}=e,s=document.querySelector(".search__output");if(!t){s.innerHTML="<div>Ничего не найдено</div>";return}const r=`
  <div class="total-count"><span>Найдено ${t} репозиториев</span></div>
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
  `;let o="",c="";for(let a of n){let{name:h,html_url:m,description:i,updated_at:g,language:y,stargazers_count:_}=a;i&&i.length>200&&(i=i.slice(0,200)),o+=`
      <tr>
          <td><a title="Имя репозитория" target="_blank" href="${m}">${h}</a></td>
          <td>${_}</td>
          <td>${y}</td>
          <td>${i}</td>
          <td>${L(g)}</td>
      </tr>
    `}c=`
  </tbody>
  </table>
  `,s.innerHTML=r+o+c}function p(e,t){const{per_page:n}=w(t);return`https://api.github.com/search/repositories?q=${e}&per_page=${n}`}function w(e){const{per_page:t}=e,n={per_page:0,message:{per_page:""}};return t>100?(n.per_page=100,n.message.per_page="Количество результатов на страницу не может превышать 100"):n.per_page=t,n}
