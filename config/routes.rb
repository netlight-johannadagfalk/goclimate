# frozen_string_literal: true

Rails.application.routes.draw do
  # API. Available on subdomain `api.` in production and under path `/api` in other environments.
  api = proc do
    namespace 'api', path: '', defaults: { subdomain: ENV['HEROKU_ENV'] == 'production' ? 'api' : false } do
      namespace 'v1', defaults: { format: :json }, constraints: { format: :json } do
        resource :flight_footprint, only: [:show]
      end

      resource :documentations, only: [:show], path: 'docs'
      resources :api_keys, only: [:new, :create], path_names: { new: '' }
    end

    # Other routes should not match for the api subdomain, so catch everything
    # else and return not found. This only makes a difference in production
    # where the subdomain is actually used.
    match '/', to: 'errors#not_found', via: :all
    match '*path', to: 'errors#not_found', via: :all
  end
  ENV['HEROKU_ENV'] == 'production' ? constraints(subdomain: /api|api-temporary/, &api) : scope('/api', &api)

  root 'welcome#index'

  # Devise routes for sessions, registrations & payment
  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }
  namespace :users, as: 'user' do
    devise_scope :user do
      post 'verify', to: 'registrations#verify', as: 'registration_verify'
    end

    resource :subscription, only: [:show, :update]
    resources :receipts, only: [:index, :show], param: :stripe_event_id
  end

  # Content pages
  get 'about', to: 'welcome#about'
  get 'contact', to: 'welcome#contact'
  get 'faq', to: 'welcome#faq'
  get 'press', to: 'welcome#press'
  get '100_percent_transparency', to: 'welcome#transparency'
  get 'our_projects', to: 'welcome#our_projects'
  get 'privacy_policy', to: 'welcome#privacy_policy'

  get 'business', to: 'welcome#business'
  namespace :business do
    resources :climate_reports, only: [:show, :new, :create], param: :key do
      member do
        resource :climate_report_invoice, only: [:create], path: 'invoice' do
          get 'thank_you'
        end
      end
    end
  end

  # Business page with post from employee offsetting form
  resource :business, only: [:create]

  # Partners
  get 'partners/bokanerja'
  get 'partners/inshapetravel'
  get 'partners/aob_travel'

  # Flight one time offsets
  resources :flight_offsets, only: [:new, :create], param: :key do
    member do
      get 'thank_you'
      scope format: true, constraints: { format: :pdf } do
        resource :flight_offset_certificates, only: [:show], path: :certificate
        resource :flight_offset_receipts, only: [:show], path: :receipt
      end
    end
  end

  # Dashboard
  get 'dashboard', to: 'dashboard#index'

  # User profiles
  resources :users, only: [:show], constraints: { id: /\d+/ }

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
    member do
      scope format: true, constraints: { format: :pdf } do
        resource :gift_card_receipts, only: [:show], path: :receipt, param: :key
      end
    end
  end

  # Admin
  namespace :admin do
    root to: 'dashboard#index'
    resources :api_keys
    resources :invoices
    resources :lifestyle_choices
    resources :projects
    resources :climate_report_invoices, only: [:index, :show, :edit, :update]
    resources :climate_reports, only: [:index]
    scope format: true, constraints: { format: :pdf } do
      resource :invoice_certificates, only: [:show]
    end
  end

  resource :impact_statistics, only: [:show], format: true, constraints: { format: :csv }

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
  get 'dashboard/index', to: redirect('/dashboard'), as: nil
  get '/users', to: redirect('/dashboard'), as: nil
  get '/users/edit/payment', to: redirect('/users/subscription'), as: nil
  get 'companies', to: redirect('/business'), as: nil
  get 'business_beta', to: redirect('/business'), as: nil
end
