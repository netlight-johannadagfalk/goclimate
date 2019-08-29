# frozen_string_literal: true

desc 'Build webpack'
namespace :webpack do
  task :build do
    system('./bin/yarn run build-webpack')
  end
end

Rake::Task['assets:precompile'].enhance(['webpack:build']) if Rake::Task.task_defined?('assets:precompile')
