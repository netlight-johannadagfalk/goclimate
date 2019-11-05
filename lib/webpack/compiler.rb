# frozen_string_literal: true

require 'open3'

module Webpack
  class Compiler
    class WebpackCompilationError < StandardError; end

    def compile
      current_digest = watched_files_digest
      return if @last_compile_digest == current_digest

      Rails.logger.info 'Compiling Webpack'

      output, status = Open3.capture2e('yarn run build')
      @last_compile_digest = current_digest

      raise WebpackCompilationError, "Webpack compilation failed\n\n#{indent_output(output)}" unless status.success?

      Rails.logger.info 'Compiled Webpack successfully'

      status.success?
    end

    private

    def watched_files_digest
      file_digests = watched_files.map { |file| "#{file}/#{Digest::SHA1.file(file).hexdigest}" }.join('/')

      Digest::SHA1.hexdigest(file_digests)
    end

    def watched_files
      Dir[*Webpack.config[:watch_files]].filter { |path| File.file?(path) }.sort
    end

    def indent_output(output)
      "> #{output.chomp.gsub("\n", "\n> ")}"
    end
  end
end
