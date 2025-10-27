defmodule LearningAppWeb.PageController do
  use LearningAppWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
