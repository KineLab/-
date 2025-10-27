defmodule LearningApp.Repo do
  use Ecto.Repo,
    otp_app: :learning_app,
    adapter: Ecto.Adapters.SQLite3
end
