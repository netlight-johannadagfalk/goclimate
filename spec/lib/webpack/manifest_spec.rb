# frozen_string_literal: true

require 'rails_helper'
require 'webpack/manifest'

RSpec.describe Webpack::Manifest do
  subject(:manifest) { described_class.new('spec/fixtures/webpack/manifest.json') }

  shared_context 'when manifest goes stale' do # rubocop:disable Metrics/BlockLength
    subject(:manifest) { described_class.new(manifest_path) }

    let(:manifest_path) { Pathname.new(tmpdir).join('manifest.json') }
    let(:original_main) { 'main-3361415d7eb404d0ce5b.js' }
    let(:changed_main) { 'main-changed.js' }
    let(:manifest_json) { <<~JSON }
      {
        "entrypoints": {
          "main": { "js": [ "#{original_main}" ] }
        },
        "main.js": "#{original_main}"
      }
    JSON
    let(:manifest_json_changed) { <<~JSON }
      {
        "entrypoints": {
          "main": { "js": [ "#{changed_main}" ] }
        },
        "main.js": "#{changed_main}"
      }
    JSON

    attr_reader :tmpdir

    def write_manifest(contents)
      File.open(manifest_path, 'w') { |file| file.write(contents) }
    end

    def change_manifest
      write_manifest(manifest_json_changed)
    end

    around do |example|
      Dir.mktmpdir('manifest_spec-') do |dir|
        @tmpdir = dir
        write_manifest(manifest_json)
        example.run
      end
    end
  end

  shared_context 'when configured to watch for changes' do
    around do |example|
      initial = Webpack.config[:watch_changes]
      Webpack.config[:watch_changes] = true
      example.run
      Webpack.config[:watch_changes] = initial
    end
  end

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

    context 'when manifest goes stale' do
      include_context 'when manifest goes stale'

      it 'still returns original contents' do
        manifest # Access manifest so it gets initialized

        change_manifest

        expect(manifest.asset_hashed_path('main.js'))
          .to eq(original_main)
      end

      context 'when configured to watch for changes' do
        include_context 'when configured to watch for changes'

        it 'still returns original contents' do
          manifest # Access manifest so it gets initialized

          change_manifest

          expect(manifest.asset_hashed_path('main.js'))
            .to eq(changed_main)
        end
      end
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

    context 'when manifest goes stale' do
      include_context 'when manifest goes stale'

      it 'still returns original contents' do
        manifest # Access manifest so it gets initialized

        change_manifest

        expect(manifest.entrypoint_paths(['main'], 'js'))
          .to eq([original_main])
      end

      context 'when configured to watch for changes' do
        include_context 'when configured to watch for changes'

        it 'still returns original contents' do
          manifest # Access manifest so it gets initialized

          change_manifest

          expect(manifest.entrypoint_paths(['main'], 'js'))
            .to eq([changed_main])
        end
      end
    end
  end
end
