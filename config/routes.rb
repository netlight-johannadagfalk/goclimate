# frozen_string_literal: true

Rails.application.routes.draw do
  get 'partners/bokanerja'
  root 'welcome#index'

  resources :invoices
  resources :lifestyle_choices
  resources :projects
  resources :stripe_events
  get 'dashboard/index'

  devise_scope :user do
    get 'users/edit/payment', to: 'users/registrations#payment', as: 'payment'
    get 'users/edit/threedsecure', to: 'users/registrations#threedsecure', as: 'threedsecure'
  end
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  resources :users, only: [:show]

  get '/users' => 'dashboard#index', as: :user_root
  get 'about', to: 'welcome#about'
  get 'contact', to: 'welcome#contact'
  get 'faq', to: 'welcome#faq'
  get 'press', to: 'welcome#press'
  get '100_percent_transparency', to: 'welcome#transparency'
  get 'our_projects', to: 'welcome#our_projects'
  get 'companies', to: 'welcome#companies'
  get 'admin', to: 'admin#index'

  resources :subscriptions
  resources :gift_cards, only: [:index, :new, :create] do
    collection do
      get 'thank_you'

      scope format: true, constraints: { format: :pdf } do
        resources :gift_card_certificates, only: [:show], path: :certificates, param: :key do
          get 'example', on: :collection
        end
      end
    end
  end

  get '/blog' => redirect('https://www.goclimateneutral.org/blog/')

  # Redirects for old routes
  get 'klimatkompensera', to: redirect('/')
  get 'friendlyguide', to: redirect('/')
  get 'gift_cards/example', to: redirect(path: '/gift_cards/certificates/example.pdf')
  get 'gift_cards/download', to: redirect { |_, r| "/gift_cards/certificates/#{r.query_parameters['key']}.pdf" }
end
