# frozen_string_literal: true

module Admin
  class ApiKeysController < AdminController
    before_action :set_api_key, only: [:show, :edit, :update, :destroy]

    # GET /admin/admin/admin/api_keys
    def index
      @api_keys = ApiKey.all
    end

    # GET /admin/api_keys/admin/1
    def show
    end

    # GET /admin/api_keys/admin/new
    def new
      @api_key = ApiKey.new
    end

    # GET /admin/api_keys/admin/1/admin/edit
    def edit
    end

    # POST /admin/api_keys
    def create
      @api_key = ApiKey.new(api_key_params)

      if @api_key.save
        redirect_to [:admin, @api_key], notice: 'API key was successfully created.'
      else
        render :new
      end
    end

    # PATCH/PUT /admin/api_keys/admin/1
    def update
      if @api_key.update(api_key_params)
        redirect_to [:admin, @api_key], notice: 'API key was successfully updated.'
      else
        render :edit
      end
    end

    # DELETE /admin/api_keys/admin/1
    def destroy
      @api_key.destroy

      redirect_to admin_api_keys_url, notice: 'API key was successfully destroyed.'
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_api_key
      @api_key = ApiKey.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def api_key_params
      params.require(:api_key).permit(:name, :usage_description, :contact_name, :contact_email)
    end
  end
end
