# frozen_string_literal: true

desc 'Build webpack'
namespace :webpack do
  task :build do
    system('./bin/yarn run build-webpack')
  end
end

# Define an empty asstes:precompile task so default assumptions about building
# a Rails app holds true even when Sprockets is disabled. Required for the
# Heroku Ruby buildpack to work correctly.
unless Rake::Task.task_defined?('assets:precompile')
  namespace :assets do
    task :precompile
    task :clean
  end
end

Rake::Task['assets:precompile'].enhance(['webpack:build'])
