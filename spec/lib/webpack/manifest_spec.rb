# frozen_string_literal: true

require 'spec_helper'
require 'webpack/manifest'

RSpec.describe Webpack::Manifest do
  subject(:manifest) { described_class.new('spec/fixtures/webpack/manifest.json') }

  describe '#initialize' do
    it 'initializes with path to manifest file' do
      expect(described_class.new('spec/fixtures/webpack/manifest.json'))
        .to be_an_instance_of(described_class)
    end

    it 'raises ManifestNotFound when not available' do
      expect do
        described_class.new('not_a_manifest.json')
      end.to raise_error(Webpack::Manifest::ManifestNotFound)
    end
  end

  describe '#asset_hashed_path' do
    it 'translates logical path to hased path' do
      expect(manifest.asset_hashed_path('images/image.png'))
        .to eq('images/image-5537be63869ef7671aaa321b25470c9d.png')
    end

    it 'raises AssetNotFound for assets not in manifest' do
      expect do
        manifest.asset_hashed_path('not_present')
      end.to raise_error(Webpack::Manifest::AssetNotFound)
    end

    it 'raises AssetNotFound for special case name "entrypoints"' do
      expect do
        manifest.asset_hashed_path('entrypoints')
      end.to raise_error(Webpack::Manifest::AssetNotFound)
    end
  end

  describe '#entrypoint_paths' do
    it 'returns all files for the given entrypoint and filetype' do
      expect(manifest.entrypoint_paths(['main'], 'js'))
        .to eq(['0-c85263b8ff4c69da5d3a.js', 'main-36cb5e44d6d3cd2067ab.js'])
    end

    it 'raises AssetNotFound when entrypoint is missing' do
      expect do
        manifest.entrypoint_paths(['not_present'], 'js')
      end.to raise_error(Webpack::Manifest::AssetNotFound)
    end

    it 'raises AssetNotFound when filetype for given entrypoint is missing' do
      expect do
        manifest.entrypoint_paths(['other'], 'css')
      end.to raise_error(Webpack::Manifest::AssetNotFound)
    end

    it 'deduplicates files present in multiple entrypoints' do
      expect(manifest.entrypoint_paths(%w[main other], 'js'))
        .to eq(['0-c85263b8ff4c69da5d3a.js', 'main-36cb5e44d6d3cd2067ab.js', 'other-36cb5e44d6d3cd2067ab.js'])
    end
  end
end
