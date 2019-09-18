# frozen_string_literal: true

module Webpack
  class Manifest
    class ManifestNotFound < StandardError; end
    class AssetNotFound < StandardError; end

    def initialize(manifest_path)
      @manifest_path = manifest_path

      load_data
    end

    def asset_hashed_path(path)
      load_data if Webpack.config[:watch_changes]

      unless @data.key?(path) && path != 'entrypoints'
        raise AssetNotFound, "The asset \"#{path}\" is not present in manifest.json."
      end

      @data[path]
    end

    def entrypoint_paths(entrypoints, filetype)
      load_data if Webpack.config[:watch_changes]

      entrypoints.flat_map do |entrypoint|
        unless @data['entrypoints'].key?(entrypoint)
          raise AssetNotFound, "The entrypoint \"#{entrypoint}\" is not present in manifest.json."
        end

        @data['entrypoints'][entrypoint][filetype] if @data['entrypoints'][entrypoint].key?(filetype)
      end.compact.uniq
    end

    private

    def load_data
      @data = JSON.parse(File.read(@manifest_path))
    rescue Errno::ENOENT
      raise ManifestNotFound, <<~TEXT
        The manifest could not be found at \"#{@manifest_path}\". Make sure that you've built with `yarn run webpack-build` and that paths are correctly configured.
      TEXT
    end
  end
end
