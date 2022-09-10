class CreateFrameworks < ActiveRecord::Migration[7.0]
  def change
    create_table :frameworks do |t|
      t.string :name
      t.string :original_creators
      t.string :website
      t.string :languages
      t.integer :release_year
      t.string :source_code_url
      t.string :related_technologies
      t.string :usage_statistics_url
      t.text :headline
      t.text :description
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
