# t = {1, 2, 3}
# {a, _, _c} = t



# data = {"Jane", 30, "developer"}
# {"Jane", age, _position} = data




# t = {a, _b, _c}
# t = {1, 2, 3}
# IO.inspect(a)


# data = %{
#   status: "error",
#   user: %{
#     name: "Anton",
#     role: "admin"
#   }
# }

# %{
#   status: "ok",
#   user: %{
#     role: user_role}}  = data



# Версия для случая, когда пользователь ввел имя проекта
def handle_event("save", %{"project" => %{"name" => name}}, socket) do
  # name будет содержать введенное имя, например "Мой проект"
  # ...здесь логика сохранения...
  IO.puts("Сохраняем проект: #{name}")
  {:noreply, socket}
end

# Версия для случая, когда поле имени пустое
def handle_event("save", %{"project" => %{"name" => ""}}, socket) do
  # Пользователь ничего не ввел
  IO.puts("Ошибка: имя проекта не может быть пустым!")
  {:noreply, socket}
end


IO.inspect(user_role)
