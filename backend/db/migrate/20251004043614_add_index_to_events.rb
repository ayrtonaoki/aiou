class AddIndexToEvents < ActiveRecord::Migration[7.2]
  def change
    add_index :events, [:user_id, :occurred_at]
  end
end
