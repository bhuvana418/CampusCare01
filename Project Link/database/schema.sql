-- =========================================
-- CAMPUSCARE: CLEAN DATABASE REBUILD
-- =========================================

-- 1. REMOVE OLD TABLES
DROP TABLE IF EXISTS public.complaint_history CASCADE;
DROP TABLE IF EXISTS public.complaints CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;


-- =========================================
-- 2. USERS TABLE
-- =========================================

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    username VARCHAR(50) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('student', 'faculty')),

    department VARCHAR(100) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =========================================
-- 3. COMPLAINTS TABLE
-- =========================================

CREATE TABLE public.complaints (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    ticket_id VARCHAR(50) UNIQUE NOT NULL,

    user_id UUID NOT NULL
        REFERENCES public.users(id) ON DELETE CASCADE,

    username VARCHAR(50),

    student_name VARCHAR(100),

    title VARCHAR(200) NOT NULL,

    subject VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    category VARCHAR(100) NOT NULL,

    department VARCHAR(100) NOT NULL,

    location TEXT DEFAULT '',

    priority VARCHAR(20) DEFAULT 'Medium',

    status VARCHAR(30) DEFAULT 'Submitted',

    faculty_remark TEXT,

    resolution TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =========================================
-- 4. COMPLAINT HISTORY TABLE
-- =========================================

CREATE TABLE public.complaint_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    complaint_id BIGINT NOT NULL
        REFERENCES public.complaints(id) ON DELETE CASCADE,

    old_status VARCHAR(30),

    new_status VARCHAR(30) NOT NULL,

    changed_by UUID NOT NULL
        REFERENCES public.users(id),

    changed_at TIMESTAMPTZ DEFAULT NOW(),

    remarks TEXT
);


-- =========================================
-- 5. INDEXES FOR FASTER SEARCH
-- =========================================

CREATE INDEX idx_users_username
ON public.users(username);

CREATE INDEX idx_complaints_ticket
ON public.complaints(ticket_id);

CREATE INDEX idx_complaints_user
ON public.complaints(user_id);

CREATE INDEX idx_complaints_department
ON public.complaints(department);

CREATE INDEX idx_history_complaint
ON public.complaint_history(complaint_id);

CREATE INDEX idx_history_changed_by
ON public.complaint_history(changed_by);


-- =========================================
-- DATABASE CREATED SUCCESSFULLY
-- =========================================
