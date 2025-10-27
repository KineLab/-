# lib/learning_app_web/live/hello_live.ex
defmodule LearningAppWeb.HelloLive do
  use LearningAppWeb, :live_view

  # 1. 'mount' - когда ты (пользователь) заходишь на страницу
  def mount(_params, _session, socket) do
    # Мы просто говорим "ок, можно начинать"
    {:ok, socket}
  end

  # 2. 'render' - то, что мы показываем зрителю (HTML)
  def render(assigns) do
    ~H"""
    <div>
      <h2>Тестовая страница Elixir + Svelte ("Hello World")</h2>
      <p>Ниже ты видишь Svelte-компонент, которым управляет Elixir.</p>

      <button phx-click="say_hi" class="btn btn-primary btn-lg">
        Нажми меня, чтобы Elixir отправил команду!
      </button>

      <hr>

      <div
        id="svelte-greeter-wrapper"
        phx-hook="SvelteHook"
        data-component="Greeter"
        data-events={Jason.encode!(["show-greeting"])}
        data-props={Jason.encode!(%{message: "Жду..."})}>
      </div>

    </div>
    """
  end

  # 5. 'handle_event' - что делает "режиссер",
  #    когда ты нажимаешь кнопку (phx-click="say_hi")
  def handle_event("say_hi", _params, socket) do

    # 6. Мы "кричим в рацию" (JS Hook) событие "show-greeting"
    #    и передаем данные (payload):
    socket =
      push_event(socket, "show-greeting", %{
        message: "Привет, Антон! Сообщение из Elixir!"
      })

    # Говорим LiveView, что не нужно ничего перезагружать
    {:noreply, socket}
  end
end
