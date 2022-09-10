class FrameworksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_framework, only: %i[ show edit update destroy ]

  # GET /frameworks or /frameworks.json
  def index
    @frameworks = Framework.all
    respond_to do |format|
      format.html
      format.json { render json: @frameworks }
    end
  end

  # GET /frameworks/1 or /frameworks/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: @framework }
    end
  end

  # GET /frameworks/new
  def new
    @framework = Framework.new
  end

  # GET /frameworks/1/edit
  def edit
  end

  # POST /frameworks or /frameworks.json
  def create
    @framework = Framework.new(framework_params)

    respond_to do |format|
      if @framework.save
        format.html { redirect_to framework_url(@framework), notice: "Framework was successfully created." }
        format.json { render :show, status: :created, location: @framework }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @framework.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /frameworks/1 or /frameworks/1.json
  def update
    respond_to do |format|
      if @framework.update(framework_params)
        format.html { redirect_to framework_url(@framework), notice: "Framework was successfully updated." }
        format.json { render :show, status: :ok, location: @framework }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @framework.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /frameworks/1 or /frameworks/1.json
  def destroy
    @framework.destroy

    respond_to do |format|
      format.html { redirect_to frameworks_url, notice: "Framework was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_framework
      @framework = Framework.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def framework_params
      params.require(:framework)
            .permit(:name, :website, :description, :category_id,
                    images: [])
    end
end
