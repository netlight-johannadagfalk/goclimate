# frozen_string_literal: true

module Admin
  class ReferralCodesController < AdminController
    before_action :set_referral_code, only: [:show, :edit, :update, :destroy]

    def index
      @referral_codes = Subscriptions::ReferralCode.all.order(created_at: :desc)
    end

    def show
    end

    def new
      @referral_code = Subscriptions::ReferralCode.new
    end

    def edit
    end

    def create
      @referral_code = Subscriptions::ReferralCode.new(referral_code_params)

      if @referral_code.save
        redirect_to [:admin, @referral_code], notice: 'Referral code was successfully created.'
      else
        render :new
      end
    end

    def update
      if @referral_code.update(referral_code_params)
        redirect_to [:admin, @referral_code], notice: 'Referral code was successfully updated.'
      else
        render :edit
      end
    end

    def destroy
      @referral_code.destroy

      redirect_to admin_referral_codes_url, notice: 'Referral code was successfully destroyed.'
    end

    private

    def set_referral_code
      @referral_code = Subscriptions::ReferralCode.find(params[:id])
    end

    def referral_code_params
      params.require(:referral_code).permit(:code, :destination_path)
    end
  end
end
