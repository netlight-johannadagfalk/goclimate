# frozen_string_literal: true

Rails.application.routes.draw do
  root 'welcome#index'

  # Devise routes for sessions, registrations & payment
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  devise_scope :user do
    get 'users/edit/payment', to: 'users/registrations#payment', as: 'payment'
    get 'users/edit/threedsecure', to: 'users/registrations#threedsecure', as: 'threedsecure'
  end

  # Content pages
  get 'about', to: 'welcome#about'
  get 'contact', to: 'welcome#contact'
  get 'faq', to: 'welcome#faq'
  get 'press', to: 'welcome#press'
  get '100_percent_transparency', to: 'welcome#transparency'
  get 'our_projects', to: 'welcome#our_projects'
  get 'companies', to: 'welcome#companies'

  # Partners
  get 'partners/bokanerja'

  # Dashboard
  # TODO: Merge these into one route
  get 'dashboard/index'
  get '/users' => 'dashboard#index', as: :user_root

  # User profiles
  resources :users, only: [:show]

  # Gift cards
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

  # Admin
  namespace :admin do
    root to: 'dashboard#index'
    resources :invoices
    resources :lifestyle_choices
    resources :projects
    resources :stripe_events
  end

  # Errors
  match '/404', to: 'errors#not_found', via: :all
  match '/422', to: 'errors#unprocessable_entity', via: :all
  match '/500', to: 'errors#internal_server_error', via: :all

  # Vanity URL redirects
  get '/blog', to: redirect('https://www.goclimateneutral.org/blog/'), as: nil

  # Redirects for old routes. To avoid broken links on the internet, don't remove these.
  get 'klimatkompensera', to: redirect('/'), as: nil
  get 'friendlyguide', to: redirect('/'), as: nil
  get 'gift_cards/example', to: redirect(path: '/gift_cards/certificates/example.pdf'), as: nil
  get 'gift_cards/download', to: redirect { |_, r| "/gift_cards/certificates/#{r.query_parameters['key']}.pdf" },
                             as: nil
end
