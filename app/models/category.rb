class Category < ApplicationRecord
  has_many :frameworks

  validates :name, presence: true
end
