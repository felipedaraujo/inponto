class UserMailer < ActionMailer::Base
  default :from => "felipe@inponto.com.br"

  def mensagem_boas_vindas(user)
    @user = user
    @site = "http://inponto.com.br"
    mail(:to => user.email,
         :subject => "Seja bem-vindo ao meu site")
  end

end
