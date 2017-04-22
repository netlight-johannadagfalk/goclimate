Rails.application.routes.draw do

  resources :projects
  resources :stripe_events
  get 'dashboard/index'

  devise_for :users, controllers: {
  	sessions: 'users/sessions',
  	registrations: 'users/registrations'
  }

  get '/users' => 'dashboard#index', as: :user_root 

  get '', to: 'welcome#index'
  get 'step_1_choose_plan', to: 'welcome#plan'
  get 'about', to: 'welcome#about'
  get 'contact', to: 'welcome#contact'
  

  get 'step_1_reduce', to: 'welcome#reduce'
  get 'step_2_offset', to: 'welcome#offset'
  get 'step_3_impact', to: 'welcome#impact'

  resources :subscriptions

  get '/blog' => redirect("https://www.goclimateneutral.org/blog/")

  root 'welcome#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
