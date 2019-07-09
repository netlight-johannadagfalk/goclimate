# frozen_string_literal: true

module Webpack
  module Helper
    def webpack_asset_path(source)
      asset_path(
        public_path(Webpack.manifest.asset_hashed_path(source)),
        skip_pipeline: true
      )
    end

    def webpack_entrypoint_javascript_tags(*entrypoints)
      paths = Webpack.manifest.entrypoint_paths(entrypoints, 'js').map { |path| public_path(path) }
      javascript_include_tag(*paths, skip_pipeline: true)
    end

    def webpack_entrypoint_stylesheet_tags(*entrypoints)
      paths = Webpack.manifest.entrypoint_paths(entrypoints, 'css').map { |path| public_path(path) }
      stylesheet_link_tag(*paths, skip_pipeline: true)
    end

    private

    def public_path(source)
      Pathname.new("/#{Webpack.config[:output_path]}").join(source)
    end
  end
end
