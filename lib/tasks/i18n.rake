# frozen_string_literal: true

# rubocop:disable Style/StderrPuts

namespace :i18n do
  desc 'Upload & download current locale files to ensure normalized formatting and an up-to-date Crowdin pseudo-locale'
  task :normalize_crowdin do
    STDERR.puts(<<~TEXT)
      This will upload sources and translations for your current branch to Crowdin and then download all translations again. ALL TRANSLATED LOCALE FILES WILL BE REPLACED AS PART OF THIS PROCESS. Make sure you have committed anything you want to be sure to keep.
    TEXT
    STDERR.print('Continue? (y/n) ')
    abort('Aborting') unless STDIN.gets.strip == 'y'

    sh('crowdin upload sources -b $(git branch --show-current)')
    sh('crowdin upload translations -b $(git branch --show-current) --import-eq-suggestions --auto-approve-imported')
    sh('crowdin download -b $(git branch --show-current) --skip-untranslated-strings')
  end
end

# rubocop:enable Style/StderrPuts
