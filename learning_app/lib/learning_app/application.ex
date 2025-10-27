defmodule LearningApp.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      LearningAppWeb.Telemetry,
      LearningApp.Repo,
      {DNSCluster, query: Application.get_env(:learning_app, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: LearningApp.PubSub},
      # Start a worker by calling: LearningApp.Worker.start_link(arg)
      # {LearningApp.Worker, arg},
      # Start to serve requests, typically the last entry
      LearningAppWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: LearningApp.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    LearningAppWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
