-- Create user roles enum
create type public.app_role as enum ('admin', 'moderator', 'user');

-- Create profiles table
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  display_name text,
  email text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);

-- Create equipment table
create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  serial_number text not null,
  department text not null,
  status text not null default 'operational',
  active_repairs integer not null default 0,
  last_maintenance date,
  image text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Create technicians table
create table public.technicians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  avatar text,
  specialization text,
  created_at timestamp with time zone not null default now()
);

-- Create teams table
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Create team_members junction table
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.teams(id) on delete cascade not null,
  technician_id uuid references public.technicians(id) on delete cascade not null,
  unique (team_id, technician_id)
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.equipment enable row level security;
alter table public.technicians enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;

-- Security definer function for role checking
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS Policies for profiles
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = user_id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = user_id);

-- RLS Policies for user_roles
create policy "Users can view their own roles" on public.user_roles for select using (auth.uid() = user_id);

-- RLS Policies for equipment
create policy "Users can view their own equipment" on public.equipment for select using (auth.uid() = user_id);
create policy "Users can create their own equipment" on public.equipment for insert with check (auth.uid() = user_id);
create policy "Users can update their own equipment" on public.equipment for update using (auth.uid() = user_id);
create policy "Users can delete their own equipment" on public.equipment for delete using (auth.uid() = user_id);

-- RLS Policies for technicians
create policy "Users can view their own technicians" on public.technicians for select using (auth.uid() = user_id);
create policy "Users can create their own technicians" on public.technicians for insert with check (auth.uid() = user_id);
create policy "Users can update their own technicians" on public.technicians for update using (auth.uid() = user_id);
create policy "Users can delete their own technicians" on public.technicians for delete using (auth.uid() = user_id);

-- RLS Policies for teams
create policy "Users can view their own teams" on public.teams for select using (auth.uid() = user_id);
create policy "Users can create their own teams" on public.teams for insert with check (auth.uid() = user_id);
create policy "Users can update their own teams" on public.teams for update using (auth.uid() = user_id);
create policy "Users can delete their own teams" on public.teams for delete using (auth.uid() = user_id);

-- RLS Policies for team_members
create policy "Users can view team members of their teams" on public.team_members for select using (
  exists (select 1 from public.teams where teams.id = team_members.team_id and teams.user_id = auth.uid())
);
create policy "Users can add members to their teams" on public.team_members for insert with check (
  exists (select 1 from public.teams where teams.id = team_members.team_id and teams.user_id = auth.uid())
);
create policy "Users can remove members from their teams" on public.team_members for delete using (
  exists (select 1 from public.teams where teams.id = team_members.team_id and teams.user_id = auth.uid())
);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, email)
  values (new.id, new.raw_user_meta_data ->> 'display_name', new.email);
  
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update timestamps
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at_column();
create trigger update_equipment_updated_at before update on public.equipment for each row execute function public.update_updated_at_column();
create trigger update_teams_updated_at before update on public.teams for each row execute function public.update_updated_at_column();