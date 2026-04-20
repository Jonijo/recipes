CREATE TABLE recipes (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description VARCHAR(500),
    description TEXT,
    ingredients_text TEXT,
    steps_text TEXT,
    prep_time INT,
    cook_time INT,
    servings INT,
    difficulty VARCHAR(16),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    access_type VARCHAR(16) NOT NULL DEFAULT 'FREE',
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    image_url VARCHAR(1024),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT recipes_access_type_check CHECK (access_type IN ('FREE', 'PREMIUM'))
);

CREATE UNIQUE INDEX ux_recipes_slug ON recipes (LOWER(slug));
CREATE INDEX ix_recipes_category ON recipes (category_id);
CREATE INDEX ix_recipes_published ON recipes (is_published);
CREATE INDEX ix_recipes_featured ON recipes (is_featured);
