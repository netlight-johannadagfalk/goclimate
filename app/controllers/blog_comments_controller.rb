# frozen_string_literal: true

class BlogCommentsController < ApplicationController
  def create
    @wordpress_client = WordpressClient.new(
      url: "http://localhost:5000/wp-json/",
      username: "test",
      password: "test",
    )
    @wordpress_client.create_comment(
      author_name: params[:name],
      author_email: params[:email],
      content: params[:comment], 
      post: 1
    )  
  end

  
end
