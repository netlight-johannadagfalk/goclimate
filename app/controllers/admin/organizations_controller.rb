# frozen_string_literal: true

module Admin
  class OrganizationsController < AdminController
    before_action :set_organization, only: [:show, :edit, :update, :destroy]

    def index
      @organizations = Organization.all.order(name: :asc)
    end

    def show
    end

    def new
      @organization = Organization.new
    end

    def edit
    end

    def create
      @organization = Organization.new(organization_params)

      unless @organization.save
        render :new
        return
      end

      redirect_to [:admin, @organization], notice: 'Organization was successfully created.'
    end

    def update
      unless @organization.update(organization_params)
        render :edit
        return
      end

      redirect_to [:admin, @organization], notice: 'Organization was successfully updated.'
    end

    def destroy
      @organization.destroy

      redirect_to admin_organizations_url, notice: 'Organization was successfully destroyed.'
    end

    private

    def set_organization
      @organization = Organization.find(params[:id])
    end

    def organization_params
      params.require(:organization).permit(:name)
    end
  end
end
