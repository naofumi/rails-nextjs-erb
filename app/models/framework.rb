class Framework < ApplicationRecord
  belongs_to :category
  has_one_attached :header_image
  has_many_attached :images
end
