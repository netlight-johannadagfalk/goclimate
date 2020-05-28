# frozen_string_literal: true

class BlogPostsController < ApplicationController
  def index
    @wordpress_client = WordpressClient.new(
      url: "http://localhost:5000/wp-json/",
      username: "test",
      password: "test",
    )
    @posts = @wordpress_client.posts(per_page: 20)
    @comments = @wordpress_client.comments(per_page: 1, post: 1)
  end

  def show
    @wordpress_client = WordpressClient.new(
      url: "http://localhost:5000/wp-json/",
      username: "test",
      password: "test",
    )
    @post = @wordpress_client.find_post(params[:id])
    @comments = @wordpress_client.comments(page: 1, post: params[:id])
  end
end
