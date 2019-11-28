# frozen_string_literal: true

module Admin
  class ProjectsController < AdminController
    before_action :set_project, only: [:show, :edit, :update, :destroy]

    # GET /projects
    # GET /projects.json
    def index
      @projects = Project.all.order(id: :desc)
      @total_co2 = Project.all.sum('co2e') / 1000
      @total_sek_spent = Project.all.sum('cost_in_sek')
    end

    # GET /projects/1
    # GET /projects/1.json
    def show
    end

    # GET /projects/new
    def new
      @project = Project.new
    end

    # GET /projects/1/edit
    def edit
    end

    # POST /projects
    # POST /projects.json
    def create
      @project = Project.new(project_params)

      respond_to do |format|
        if @project.save
          format.html { redirect_to admin_project_path(@project), notice: 'Project was successfully created.' }
          format.json { render :show, status: :created, location: @project }
        else
          format.html { render :new }
          format.json { render json: @project.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /projects/1
    # PATCH/PUT /projects/1.json
    def update
      respond_to do |format|
        if @project.update(project_params)
          format.html { redirect_to admin_project_path(@project), notice: 'Project was successfully updated.' }
          format.json { render :show, status: :ok, location: @project }
        else
          format.html { render :edit }
          format.json { render json: @project.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /projects/1
    # DELETE /projects/1.json
    def destroy
      @project.destroy
      respond_to do |format|
        format.html { redirect_to admin_projects_url, notice: 'Project was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_params
      params.require(:project).permit(
        :name, :cdm_url, :image_url, :blog_url, :longitude, :latitude,
        :co2e, :country, :offset_type, :cost_in_sek, :date_bought,
        :certificate_url, :invoice_url, :gold_standard_id, :cdm_id,
        :start_block, :end_block, :gold_standard_url
      )
    end
  end
end
