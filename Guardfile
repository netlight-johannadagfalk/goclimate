guard :rspec, cmd: "bin/rspec --format doc" do
  require "guard/rspec/dsl"
  dsl = Guard::RSpec::Dsl.new(self)

  # RSpec files
  rspec = dsl.rspec
  watch(rspec.spec_helper) { rspec.spec_dir }
  watch(rspec.spec_support) { rspec.spec_dir }
  watch(rspec.spec_files)

  # Ruby files
  ruby = dsl.ruby
  dsl.watch_spec_files_for(ruby.lib_files)

  # Rails files
  rails = dsl.rails(view_extensions: %w(erb))
  dsl.watch_spec_files_for(rails.app_files)

  watch(rails.controllers) { |m| rspec.spec.call("requests/#{m[1]}") }
  watch(rails.view_dirs) { |m| rspec.spec.call("features/#{m[1]}") }
  watch(rails.layouts) { |m| rspec.spec.call("features/#{m[1]}") }

  # Rails config changes
  watch(rails.spec_helper) { rspec.spec_dir }
end
