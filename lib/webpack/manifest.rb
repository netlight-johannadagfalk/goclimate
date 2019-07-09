# frozen_string_literal: true

module Webpack
  class Manifest
    class ManifestNotFound < StandardError; end
    class AssetNotFound < StandardError; end

    def initialize(manifest_path)
      @data = JSON.parse(File.read(manifest_path))
    rescue Errno::ENOENT
      raise ManifestNotFound, <<~TEXT
        The manifest could not be found at \"#{manifest_path}\". Make sure that you've built with `yarn run build` and that paths are correctly configured.
      TEXT
    end

    def asset_hashed_path(path)
      unless @data.key?(path) && path != 'entrypoints'
        raise AssetNotFound, "The asset \"#{path}\" is not present in manifest.json."
      end

      @data[path]
    end

    def entrypoint_paths(entrypoints, filetype)
      entrypoints.flat_map do |entrypoint|
        unless @data['entrypoints'].key?(entrypoint)
          raise AssetNotFound, "The entrypoint \"#{entrypoint}\" is not present in manifest.json."
        end

        unless @data['entrypoints'][entrypoint].key?(filetype)
          raise AssetNotFound, <<~TEXT
            The entrypoint \"#{entrypoint}\" does not contain any files for filetype \"#{filetype}\".
          TEXT
        end

        @data['entrypoints'][entrypoint][filetype]
      end.uniq
    end
  end
end
