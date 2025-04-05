
-- Create a table for public profiles
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    name text,
    avatar_url text,
    preferences jsonb default '{"measurementSystem": "metric", "bakingExperience": "beginner", "favoriteBreads": []}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up row level security
alter table public.profiles
    enable row level security;

-- This allows users to read any profile
create policy "Anyone can view profiles"
    on profiles for select
    using (true);

-- This allows users to update only their own profile
create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, name, avatar_url)
    values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), new.raw_user_meta_data->>'avatar_url');
    return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
