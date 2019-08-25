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

  def self.compiler
    @compiler ||= Compiler.new
  end

  def self.dev_server_running?
    Socket.tcp(Webpack.config[:dev_server_host], Webpack.config[:dev_server_port], connect_timeout: 0.01).close
    true
  rescue StandardError
    false
  end
end
