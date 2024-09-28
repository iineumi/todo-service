-- テーブルの作成
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    due_date TIMESTAMP WITH TIME ZONE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE INDEX tasks_due_date_idx ON tasks (due_date);
CREATE INDEX tasks_completed_idx ON tasks (completed);


-- 初期データの投入 (5件)
INSERT INTO tasks (id, title, description, due_date, completed, is_archived) VALUES
    ('0f04693f-fd65-4d7f-9082-12a1942d0c33', 'Grocery Shopping', 'Buy milk, eggs, bread, and cheese from the supermarket.', '2024-08-10 10:00:00+09', FALSE, FALSE),
    (gen_random_uuid(), 'Book Doctor Appointment', 'Schedule a check-up appointment with Dr. Smith.', '2024-08-15 14:00:00+09', FALSE, FALSE),
    (gen_random_uuid(), 'Pay Bills', 'Pay electricity and internet bills.', '2024-08-20 18:00:00+09', FALSE, FALSE),
    (gen_random_uuid(), 'Prepare Presentation', 'Prepare slides and materials for the upcoming presentation.', '2024-08-22 09:00:00+09', FALSE, FALSE),
    (gen_random_uuid(), 'Write Blog Post', 'Write a blog post about the latest technology trends.', '2024-08-25 17:00:00+09', FALSE, FALSE);
