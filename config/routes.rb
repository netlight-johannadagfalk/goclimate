Rails.application.routes.draw do

  get '', to: 'welcome#index'
  get 'step_1_reduce', to: 'welcome#reduce'
  get 'step_2_offset', to: 'welcome#offset'
  get 'step_3_impact', to: 'welcome#impact'

  resources :subscriptions

  root 'welcome#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
