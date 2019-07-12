# frozen_string_literal: true

module Webpack
  def self.config
    @config ||=
      YAML.safe_load(Rails.root.join('config', 'webpack.yml').read, aliases: true)[Rails.env].deep_symbolize_keys
  end

  def self.manifest
    @manifest ||= Manifest.new(Rails.root.join('public', config[:output_path], 'manifest.json'))
  end

  def self.manifest=(manifest)
    @manifest = manifest
  end
end
