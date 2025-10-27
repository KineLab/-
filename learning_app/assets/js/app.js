// ============================================
// ГЛАВНЫЙ ФАЙЛ JAVASCRIPT ДЛЯ PHOENIX
// ============================================
// Этот файл запускается, когда пользователь открывает ваш сайт.
// Он создает "живое" соединение между браузером и сервером.

// ============================================
// 1. ИМПОРТЫ (загружаем нужные инструменты)
// ============================================

// Phoenix HTML - для работы форм и кнопок
import "phoenix_html"

// Phoenix LiveView - для "живых" страниц без перезагрузки
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"

// Topbar - полоска загрузки сверху страницы
import topbar from "../vendor/topbar"



// ============================================
// 2. ХУКИ (HOOKS) - "Рации" между Elixir и JavaScript
// ============================================
// Хуки позволяют Elixir управлять JavaScript-компонентами.
// Например: Elixir говорит "покажи окно загрузки" → JavaScript показывает Svelte-компонент

let Hooks = {}; // Объект-контейнер для всех хуков

// ============================================
// Хук: SvelteHook
// ============================================
// Универсальный хук для подключения любых Svelte-компонентов.
//
// Как использовать в HTML (Elixir):
//   <div phx-hook="SvelteHook"
//        data-component="Greeter"
//        data-props={Jason.encode!(%{message: "Привет"})}>
//   </div>
//
// Что происходит:
// 1. LiveView создает div с хуком
// 2. Хук видит data-component="Greeter"
// 3. Хук ищет window.LearningApp.Greeter
// 4. Хук создает Svelte-компонент внутри div

Hooks.SvelteHook = {

  // mounted() - вызывается, когда элемент ПОЯВЛЯЕТСЯ на странице
  mounted() {
    // Шаг 1: Узнаем, какой компонент нужно создать
    const componentName = this.el.dataset.component;
    if (!componentName) {
      console.error("❌ Ошибка: нет атрибута data-component на элементе", this.el);
      return;
    }

    // Шаг 2: Проверяем, что компонент загружен в window.LearningApp
    if (window.LearningApp && window.LearningApp[componentName]) {
      const Component = window.LearningApp[componentName];

      // Шаг 3: Готовим свойства (props) для компонента
      const props = {
        ...JSON.parse(this.el.dataset.props || '{}'), // Данные из Elixir
        hook: this // Передаем хук для обратной связи (JS → Elixir)
      };

      console.log("✅ Создаем Svelte-компонент:", componentName, "с props:", props);

      // Шаг 4: Создаем Svelte-компонент
      this.app = new Component({
        target: this.el,  // Куда вставить компонент
        props: props      // Какие данные передать
      });

      // Шаг 5: Подписываемся на события от Elixir (если указаны)
      // Например: data-events='["show-greeting", "update-data"]'
      const events = this.el.dataset.events;
      console.log("📋 data-events attribute:", events);

      if (events) {
        try {
          const eventList = JSON.parse(events);
          console.log("📋 Parsed event list:", eventList);

          eventList.forEach(eventName => {
            console.log(`📡 Подписываюсь на событие "${eventName}" от Elixir`);

            this.handleEvent(eventName, (payload) => {
              console.log(`📨 Получено событие "${eventName}" от Elixir:`, payload);
              // Обновляем props компонента данными из события
              if (this.app) {
                console.log("🔄 Обновляю Svelte-компонент с данными:", payload);
                this.app.$set(payload);
                console.log("✅ Svelte-компонент обновлен!");
              } else {
                console.error("❌ this.app не существует!");
              }
            });
          });
        } catch (e) {
          console.error("❌ Ошибка парсинга data-events:", e);
        }
      } else {
        console.warn("⚠️ data-events не указан для компонента", componentName);
      }
    } else {
      console.error(`❌ Компонент "${componentName}" не найден. Проверьте, что learning.js загружен.`);
    }
  },

  // destroyed() - вызывается, когда элемент ИСЧЕЗАЕТ со страницы
  destroyed() {
    // Уничтожаем Svelte-компонент, чтобы не было утечек памяти
    if (this.app) {
      this.app.$destroy();
      console.log("🧹 Svelte-компонент удален");
    }
  }
};

// ============================================
// 3. НАСТРОЙКА ПРИЛОЖЕНИЯ
// ============================================

// Получаем CSRF токен из HTML (защита от взлома)
const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")

// ============================================
// ОТЛАДКА: Проверка загрузки window.LearningApp
// ============================================
console.log("🔍 Проверяю window.LearningApp...");
if (window.LearningApp) {
  console.log("✅ window.LearningApp загружен:", window.LearningApp);
  console.log("✅ Доступные компоненты:", Object.keys(window.LearningApp));
} else {
  console.error("❌ window.LearningApp НЕ загружен! Проверьте, что learning.js загружается до app.js");
}

// Создаем LiveSocket - "живое" соединение с сервером
const liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,        // Запасной вариант соединения
  params: {_csrf_token: csrfToken}, // Токен безопасности
  hooks: Hooks                      // Наши "рации" для Svelte
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

// The lines below enable quality of life phoenix_live_reload
// development features:
//
//     1. stream server logs to the browser console
//     2. click on elements to jump to their definitions in your code editor
//
if (process.env.NODE_ENV === "development") {
  window.addEventListener("phx:live_reload:attached", ({detail: reloader}) => {
    // Enable server log streaming to client.
    // Disable with reloader.disableServerLogs()
    reloader.enableServerLogs()

    // Open configured PLUG_EDITOR at file:line of the clicked element's HEEx component
    //
    //   * click with "c" key pressed to open at caller location
    //   * click with "d" key pressed to open at function component definition location
    let keyDown
    window.addEventListener("keydown", e => keyDown = e.key)
    window.addEventListener("keyup", e => keyDown = null)
    window.addEventListener("click", e => {
      if(keyDown === "c"){
        e.preventDefault()
        e.stopImmediatePropagation()
        reloader.openEditorAtCaller(e.target)
      } else if(keyDown === "d"){
        e.preventDefault()
        e.stopImmediatePropagation()
        reloader.openEditorAtDef(e.target)
      }
    }, true)

    window.liveReloader = reloader
  })
}

