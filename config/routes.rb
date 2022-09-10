Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")

  root "categories#index"
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }

  get 'csrf', to: 'users#csrf', as: :csrf

  scope '/api', as: 'api', constraints: {format: 'application/json'} do
    resources :categories
    resources :users
    resources :frameworks
  end

  resources :users
  resources :categories
  resources :frameworks
end
