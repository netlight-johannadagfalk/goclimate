# frozen_string_literal: true

class ExperimentsAssignment
  CURRENT_EXPERIMENTS = YAML.safe_load(File.read('config/experiments.yml'))&.deep_symbolize_keys || {}

  attr_reader :active_experiments

  def initialize(cookie_string = nil)
    @active_experiments = []

    cookie_experiments = parse_cookie_string(cookie_string)

    CURRENT_EXPERIMENTS.each do |experiment, options|
      @active_experiments << experiment if experiment_active?(experiment, options[:frequency], cookie_experiments)
    end
  end

  def enable(experiments)
    experiments.each do |experiment|
      unless @active_experiments.include?(experiment) || !CURRENT_EXPERIMENTS.key?(experiment)
        @active_experiments << experiment
      end
    end
  end

  def disable(experiments)
    experiments.each { |e| @active_experiments.delete(e) }
  end

  def cookie_string
    CURRENT_EXPERIMENTS.map do |experiment, _|
      "#{experiment}=#{@active_experiments.include?(experiment) ? '1' : '0'}"
    end.sort.join(',')
  end

  private

  def experiment_active?(experiment, frequency, cookie_experiments)
    if cookie_experiments[experiment].present?
      cookie_experiments[experiment] == '1'
    else
      rand <= frequency
    end
  end

  def parse_cookie_string(string)
    return {} if string.nil?

    string.split(',').map { |e| e.split('=') }.to_h.symbolize_keys
  end
end
