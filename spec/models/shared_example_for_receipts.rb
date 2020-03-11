# frozen_string_literal: true

RSpec.shared_examples 'a receipt' do
  describe '#date' do
    it 'returns a date' do
      expect(receipt.date).to be_a(Date)
    end
  end

  describe '#total_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount).to be_a(BigDecimal)
    end
  end

  describe '#vat_amount' do
    it 'returns a BigDecimal' do
      expect(receipt.vat_amount).to be_a(BigDecimal)
    end
  end

  describe '#total_amount_before_vat' do
    it 'returns a BigDecimal' do
      expect(receipt.total_amount_before_vat).to be_a(BigDecimal)
    end

    it 'returns total amount - vat' do
      total_without_vat = receipt.total_amount - receipt.vat_amount

      expect(receipt.total_amount_before_vat).to eq(total_without_vat)
    end
  end

  describe '#order_id' do
    it 'returns a order id string' do
      expect(receipt.order_id).to include('GCN-')
    end
  end
end
