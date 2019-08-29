# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Webpack::Helper, type: :helper do
  around :all do |each|
    manifest = Webpack.manifest
    Webpack.manifest = Webpack::Manifest.new('spec/fixtures/webpack/manifest.json')
    each.run
    Webpack.manifest = manifest
  end

  describe '#webpack_asset_path' do
    it 'resolves assets available in manifest' do
      expect(helper.webpack_asset_path('images/image.png'))
        .to eq('/bundles/images/image-5537be63869ef7671aaa321b25470c9d.png')
    end
  end

  describe '#webpack_entrypoint_javascript_tags' do
    it 'returns Javascript tags for all files for the given entrypoint' do
      expect(helper.webpack_entrypoint_javascript_tags('main', 'other')).to eq(<<~HTML.chomp)
        <script src="/bundles/0-c85263b8ff4c69da5d3a.js"></script>
        <script src="/bundles/main-36cb5e44d6d3cd2067ab.js"></script>
        <script src="/bundles/other-36cb5e44d6d3cd2067ab.js"></script>
      HTML
    end
  end

  describe '#webpack_entrypoint_stylesheet_tags' do
    it 'returns Javascript tags for all files related to the given entrypoint' do
      expect(helper.webpack_entrypoint_stylesheet_tags('main')).to eq(<<~HTML.chomp)
        <link rel="stylesheet" media="screen" href="/bundles/main-f05e04187fe502df65cf.css" />
      HTML
    end
  end
end
