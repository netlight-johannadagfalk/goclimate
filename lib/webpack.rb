# frozen_string_literal: true

# We have our own integration of Webpack because the Webpacker gem makes
# assumptions about the Webpack config that make it hard to use Webpack in an
# idiomatic way. Most importantly, Webpacker essentially requires the Webpack
# config to be inherited from the one bundled by the gem, making it hard to get
# an overview and do changes according to tooling we want to use.
#
# This integration has the same functionality as the Webpacker gem--Webpack dev
# server integration and automatic recompilation--but much simplified and
# without trying to make the Rails and Webpack worlds intertwine too deeply.
#
# Production features are tested, while dev features that are more complicated
# to test are untested. Adding tests for those could be a good idea if things
# turns brittle in the future.

require 'webpack/compiler'
require 'webpack/development_middleware' if Rails.env.development?
require 'webpack/helper'
require 'webpack/manifest'

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
