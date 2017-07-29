class WelcomeController < ApplicationController

  def index
  end

  def plan
    @lifestyle_choice_prices = LifestyleChoice.get_lifestyle_choice_prices
    gon.lifestyle_choice_prices = @lifestyle_choice_prices
  end

  def about
  end

  def contact
  end

  def faq
  end

  def cert1
    render :inline => 'j3xDCIxTqC4ePhzHBh0hlnY1K9xUSlX2T0DRMEbwR3E.DzPWrVmJmCpmfD6Kfftpgkjs1VOUAFmc-19prvfEi1o' and return
  end

  def cert2
    render :inline => '6vlQNuynTXChf3kEYpQEG3BU5wI01x2zXyYOjbM0QqM.DzPWrVmJmCpmfD6Kfftpgkjs1VOUAFmc-19prvfEi1o' and return
  end

  def cert3
    render :inline => 'KTen_LB2qGKnnNoi0svsU-EwzBDk3CipUaIurr2RF9o.DzPWrVmJmCpmfD6Kfftpgkjs1VOUAFmc-19prvfEi1o' and return
  end

end
