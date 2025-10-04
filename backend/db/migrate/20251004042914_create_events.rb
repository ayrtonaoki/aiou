class CreateEvents < ActiveRecord::Migration[7.2]
  def change
    create_table :events do |t|
      t.references :user, null: false, foreign_key: true
      t.string :event_type
      t.datetime :occurred_at
      t.jsonb :metadata

      t.timestamps
    end
  end
end
