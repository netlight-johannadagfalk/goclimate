class StripeEventsController < ApplicationController
  before_action :set_stripe_event, only: [:show, :edit, :update, :destroy]
  before_action do 
    redirect_to new_user_session_path unless current_user && current_user.id == 2
  end

  # GET /stripe_events
  # GET /stripe_events.json
  def index
    @stripe_events = StripeEvent.all
  end

  # GET /stripe_events/1
  # GET /stripe_events/1.json
  def show
  end

  # GET /stripe_events/new
  def new
    @stripe_event = StripeEvent.new
  end

  # GET /stripe_events/1/edit
  def edit
  end

  # POST /stripe_events
  # POST /stripe_events.json
  def create
    @stripe_event = StripeEvent.new(stripe_event_params)

    respond_to do |format|
      if @stripe_event.save
        format.html { redirect_to @stripe_event, notice: 'Stripe event was successfully created.' }
        format.json { render :show, status: :created, location: @stripe_event }
      else
        format.html { render :new }
        format.json { render json: @stripe_event.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /stripe_events/1
  # PATCH/PUT /stripe_events/1.json
  def update
    respond_to do |format|
      if @stripe_event.update(stripe_event_params)
        format.html { redirect_to @stripe_event, notice: 'Stripe event was successfully updated.' }
        format.json { render :show, status: :ok, location: @stripe_event }
      else
        format.html { render :edit }
        format.json { render json: @stripe_event.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /stripe_events/1
  # DELETE /stripe_events/1.json
  def destroy
    @stripe_event.destroy
    respond_to do |format|
      format.html { redirect_to stripe_events_url, notice: 'Stripe event was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stripe_event
      @stripe_event = StripeEvent.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def stripe_event_params
      params.require(:stripe_event).permit(:stripe_event_id, :stripe_customer_id, :stripe_object, :stripe_status, :stripe_amount, :stripe_created)
    end
end
