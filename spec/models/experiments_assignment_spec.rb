# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ExperimentsAssignment do
  let(:current_experiments) do
    {
      experiment1: { frequency: 1 },
      experiment2: { frequency: 0 },
      experiment3: { frequency: 0 },
      experiment4: { frequency: 0 }
    }
  end

  before do
    stub_const('ExperimentsAssignment::CURRENT_EXPERIMENTS', current_experiments)
  end

  describe '#initialize' do
    it 'randomizes active experiments' do
      assignment = described_class.new

      expect(assignment.active_experiments).to eq([:experiment1])
    end

    it 'adheres to previous assignment provided by cookie string' do
      assignment = described_class.new('experiment1=0,experiment2=1')

      expect(assignment.active_experiments).to eq([:experiment2])
    end
  end

  describe '#cookie_string' do
    it 'generates cookie string with all current experiments' do
      assignmet = described_class.new

      expect(assignmet.cookie_string).to eq('experiment1=1,experiment2=0,experiment3=0,experiment4=0')
    end

    it 'sorts keys alphabetically' do
      stub_const(
        'ExperimentsAssignment::CURRENT_EXPERIMENTS',
        { b: { frequency: 1 }, a: { frequency: 1 } }
      )

      assignment = described_class.new

      expect(assignment.cookie_string).to eq('a=1,b=1')
    end
  end

  describe '#enable' do
    it 'adds provided experiments to list of active ones' do
      assignment = described_class.new

      assignment.enable([:experiment3])

      expect(assignment.active_experiments).to include(:experiment3)
    end

    it 'does not add non-existing experiments' do
      assignment = described_class.new

      assignment.enable([:not_an_expriment])

      expect(assignment.active_experiments).not_to include(:not_an_expriment)
    end
  end

  describe '#disable' do
    it 'removes provided experiments from active ones' do
      assignment = described_class.new('experiment1=1')

      assignment.disable([:experiment1])

      expect(assignment.active_experiments).not_to include(:experiment1)
    end
  end
end
