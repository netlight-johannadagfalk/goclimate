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


  get '/users' => 'dashboard#index', as: :user_root 

  get '', to: 'welcome#index'
  get 'step_1_choose_plan', to: 'welcome#plan'
  get 'about', to: 'welcome#about'
  get 'contact', to: 'welcome#contact'
  get 'faq', to: 'welcome#faq'

  resources :subscriptions

  get '/blog' => redirect("https://www.goclimateneutral.org/blog/")

  get '.well-known/acme-challenge/j3xDCIxTqC4ePhzHBh0hlnY1K9xUSlX2T0DRMEbwR3E', to: 'welcome#cert1'
  get '.well-known/acme-challenge/6vlQNuynTXChf3kEYpQEG3BU5wI01x2zXyYOjbM0QqM', to: 'welcome#cert2'
  get '.well-known/acme-challenge/KTen_LB2qGKnnNoi0svsU-EwzBDk3CipUaIurr2RF9o', to: 'welcome#cert3'

  root 'welcome#index'

#  unless Rails.application.config.consider_all_requests_local
#    get '*path', to: 'errors#error_404', via: :all
#  end
end
