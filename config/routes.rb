Rails.application.routes.draw do

  resources :lifestyle_choices
  resources :projects
  resources :stripe_events
  get 'dashboard/index'

  devise_scope :user do
    get 'users/edit/payment', to: 'users/registrations#payment', as: 'payment'
  end
  devise_for :users, controllers: {
  	sessions: 'users/sessions',
  	registrations: 'users/registrations'
  }
  resources :users, :only => [:show]

  get '/users' => 'dashboard#index', as: :user_root 
  get '', to: 'welcome#index'
  get 'step_1_choose_plan', to: 'welcome#plan'
  get 'about', to: 'welcome#about'
  get 'contact', to: 'welcome#contact'
  get 'faq', to: 'welcome#faq'

  resources :subscriptions

  get '/blog' => redirect("https://www.goclimateneutral.org/blog/")

  root 'welcome#index'

#  unless Rails.application.config.consider_all_requests_local
#    get '*path', to: 'errors#error_404', via: :all
#  end
end
