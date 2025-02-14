-- Create tables
CREATE TABLE IF NOT EXISTS public.category
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    parentid INTEGER
);

CREATE TABLE IF NOT EXISTS public.book
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    categoryid INTEGER,

    FOREIGN KEY (categoryid) REFERENCES public.category (id)
    ON UPDATE NO ACTION
    ON DELETE CASCADE
);

-- Insert complex hierarchical categories with multiple subcategories at each level
INSERT INTO category (name, parentid) VALUES
-- Level 1
('Fiction', NULL), ('Science Fiction', NULL), ('Fantasy', NULL), ('Non-Fiction', NULL),
-- Level 2
('Classic Fiction', 1), ('Modern Fiction', 1), ('Dystopian', 2), ('Space Opera', 2), ('High Fantasy', 3), ('Urban Fantasy', 3), ('Biography', 4), ('History', 4),
-- Level 3
('19th Century Classics', 5), ('20th Century Classics', 5), ('Post-Apocalyptic', 7), ('Time Travel', 7), ('Epic Fantasy', 9), ('Mythic Fantasy', 9), ('Memoir', 11), ('War History', 12),
-- Level 4
('Victorian Era', 9), ('Modern Era', 10), ('Cyberpunk', 8), ('Biopunk', 8), ('Sword and Sorcery', 13), ('Dark Fantasy', 13), ('Autobiography', 15), ('Political History', 16),
-- Level 5
('Gothic Fiction', 17), ('Romantic Fiction', 17), ('AI Fiction', 19), ('Genetic Fiction', 19), ('Heroic Fantasy', 21), ('Supernatural Fantasy', 21), ('Literary Biography', 23), ('Military History', 24);

-- Insert 14 books with different categories into existing Book table
INSERT INTO book (name, author, categoryid, description) VALUES
('Pride and Prejudice', 'Jane Austen', 18, 'A classic novel of manners and marriage in early 19th century England.'),
('1984', 'George Orwell', 20, 'A dystopian social science fiction novel and cautionary tale about the future.'),
('The Hobbit', 'J.R.R. Tolkien', 22, 'A fantasy novel about the journey of Bilbo Baggins, a hobbit who ventures into an epic quest.'),
('Steve Jobs', 'Walter Isaacson', 26, 'A biography of the Apple co-founder, Steve Jobs.'),
('Frankenstein', 'Mary Shelley', 18, 'A gothic novel about a scientist who creates a monstrous creature.'),
('Brave New World', 'Aldous Huxley', 20, 'A dystopian novel set in a technologically advanced future.'),
('The Name of the Wind', 'Patrick Rothfuss', 22, 'A fantasy novel following the adventures of Kvothe, a young magician.'),
('Becoming', 'Michelle Obama', 26, 'A memoir by the former First Lady of the United States.'),
('Dracula', 'Bram Stoker', 18, 'A gothic horror novel introducing Count Dracula and vampire lore.'),
('Dune', 'Frank Herbert', 20, 'A science fiction novel about politics, religion, and ecology on the desert planet Arrakis.');

INSERT INTO book (name, author, categoryid, description) VALUES
('To Kill a Mockingbird', 'Harper Lee', 1, 'A novel about the racial injustice in the Deep South.'),
('Neuromancer', 'William Gibson', 2, 'A cyberpunk novel that shaped the science fiction genre.'),
('Harry Potter and the Philosopher’s Stone', 'J.K. Rowling', 3, 'The first book in the Harry Potter fantasy series.'),
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 4, 'A book exploring the history and impact of Homo sapiens.');