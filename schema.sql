-- ============================================================
-- WellMind Database Schema
-- All tables generated from Entity-Relationship Design
-- Run: psql -U postgres -d wellmind_db -f schema.sql
-- ============================================================

-- ── Lookup / Type tables first (no dependencies) ────────────

CREATE TABLE user_type (
    user_type_id    SERIAL PRIMARY KEY,
    user_type_name  VARCHAR(50) NOT NULL
);

CREATE TABLE mood_type (
    mood_type_id    SERIAL PRIMARY KEY,
    mood_name       VARCHAR(50) NOT NULL,
    mood_score      INT NOT NULL
);

CREATE TABLE trigger_type (
    trigger_type_id SERIAL PRIMARY KEY,
    trigger_name    VARCHAR(100) NOT NULL
);

CREATE TABLE risk_level (
    risk_level_id   SERIAL PRIMARY KEY,
    level_name      VARCHAR(50) NOT NULL,
    score_range     VARCHAR(20) NOT NULL,
    action_required VARCHAR(100) NOT NULL
);

CREATE TABLE alert_type (
    alert_type_id   SERIAL PRIMARY KEY,
    type_name       VARCHAR(100) NOT NULL,
    default_severity VARCHAR(20) NOT NULL,
    auto_escalate   BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE response_category (
    category_id     SERIAL PRIMARY KEY,
    category_name   VARCHAR(100) NOT NULL
);

CREATE TABLE content_type (
    content_type_id SERIAL PRIMARY KEY,
    type_name       VARCHAR(100) NOT NULL
);

-- ── Institution (no user dependency) ────────────────────────

CREATE TABLE institution (
    institution_id   SERIAL PRIMARY KEY,
    institution_name VARCHAR(200) NOT NULL,
    institution_type VARCHAR(100) NOT NULL,
    address          TEXT,
    contact_email    VARCHAR(200),
    status           VARCHAR(20) NOT NULL DEFAULT 'Active'
);

-- ── User (depends on user_type) ─────────────────────────────

CREATE TABLE "user" (
    user_id         SERIAL PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    date_of_birth   DATE NOT NULL,
    gender          VARCHAR(20),
    email           VARCHAR(200) UNIQUE NOT NULL,
    phone_number    VARCHAR(20),
    password        VARCHAR(255) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'Active',
    user_type_id    INT REFERENCES user_type(user_type_id)
);

-- ── Emergency Contact (depends on user) ─────────────────────

CREATE TABLE emergency_contact (
    contact_id      SERIAL PRIMARY KEY,
    user_id         INT REFERENCES "user"(user_id),
    contact_name    VARCHAR(100) NOT NULL,
    relationship    VARCHAR(100),
    phone_number    VARCHAR(20),
    email           VARCHAR(200)
);

-- ── Staff Profile (depends on user, institution) ─────────────

CREATE TABLE staff_profile (
    staff_id        SERIAL PRIMARY KEY,
    user_id         INT REFERENCES "user"(user_id),
    institution_id  INT REFERENCES institution(institution_id),
    role            VARCHAR(100) NOT NULL,
    specialization  VARCHAR(100)
);

-- ── User Assignment (depends on user, staff_profile) ─────────

CREATE TABLE user_assignment (
    assignment_id   SERIAL PRIMARY KEY,
    user_id         INT REFERENCES "user"(user_id),
    staff_id        INT REFERENCES staff_profile(staff_id),
    assigned_date   DATE NOT NULL,
    status          VARCHAR(50) NOT NULL DEFAULT 'Active'
);

-- ── Mood Log (depends on user, mood_type, trigger_type) ──────

CREATE TABLE mood_log (
    log_id          SERIAL PRIMARY KEY,
    user_id         INT REFERENCES "user"(user_id),
    mood_type_id    INT REFERENCES mood_type(mood_type_id),
    mood_score      INT NOT NULL CHECK (mood_score BETWEEN 1 AND 10),
    journal_notes   TEXT,
    sleep_hours     DECIMAL(4,1),
    log_date        DATE NOT NULL,
    log_time        TIME NOT NULL,
    trigger_type_id INT REFERENCES trigger_type(trigger_type_id)
);

-- ── Conversation Session (depends on user) ───────────────────

CREATE TABLE conversation_session (
    session_id      SERIAL PRIMARY KEY,
    user_id         INT REFERENCES "user"(user_id),
    start_time      TIMESTAMP NOT NULL,
    end_time        TIMESTAMP,
    session_status  VARCHAR(20) NOT NULL DEFAULT 'Active'
);

-- ── Message (depends on conversation_session) ────────────────

CREATE TABLE message (
    message_id      SERIAL PRIMARY KEY,
    session_id      INT REFERENCES conversation_session(session_id),
    sender          VARCHAR(10) NOT NULL CHECK (sender IN ('User','AI')),
    message_text    TEXT NOT NULL,
    sent_at         TIMESTAMP NOT NULL,
    sentiment_score DECIMAL(5,2),
    is_flagged      BOOLEAN NOT NULL DEFAULT false
);

-- ── AI Configuration (depends on user_type) ──────────────────

CREATE TABLE ai_configuration (
    config_id                   SERIAL PRIMARY KEY,
    user_type_id                INT REFERENCES user_type(user_type_id),
    response_tone               VARCHAR(50) NOT NULL,
    distress_keyword_list       TEXT,
    escalation_threshold_score  DECIMAL(5,2)
);

-- ── Behavioral Record (depends on user, risk_level) ──────────

CREATE TABLE behavioral_record (
    record_id               SERIAL PRIMARY KEY,
    user_id                 INT REFERENCES "user"(user_id),
    record_date             DATE NOT NULL,
    app_usage_minutes       INT DEFAULT 0,
    login_count             INT DEFAULT 0,
    days_since_last_mood_log INT DEFAULT 0,
    avg_mood_score_7days    DECIMAL(4,2),
    sentiment_trend         VARCHAR(20),
    risk_score              INT CHECK (risk_score BETWEEN 0 AND 100),
    risk_level_id           INT REFERENCES risk_level(risk_level_id)
);

-- ── Escalation Rule (depends on institution, alert_type) ─────

CREATE TABLE escalation_rule (
    rule_id                  SERIAL PRIMARY KEY,
    institution_id           INT REFERENCES institution(institution_id),
    alert_type_id            INT REFERENCES alert_type(alert_type_id),
    severity_level           VARCHAR(20) NOT NULL,
    escalation_target        VARCHAR(50) NOT NULL,
    escalation_method        VARCHAR(50) NOT NULL,
    time_to_escalate_minutes INT DEFAULT 5
);

-- ── Alert (depends on user, alert_type) ──────────────────────

CREATE TABLE alert (
    alert_id              SERIAL PRIMARY KEY,
    user_id               INT REFERENCES "user"(user_id),
    alert_type_id         INT REFERENCES alert_type(alert_type_id),
    trigger_description   TEXT,
    severity_level        VARCHAR(20) NOT NULL,
    alert_status          VARCHAR(20) NOT NULL DEFAULT 'New',
    created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
    acknowledged_at       TIMESTAMP,
    resolved_at           TIMESTAMP
);

-- ── Content (depends on content_type, mood_type) ─────────────

CREATE TABLE content (
    content_id        SERIAL PRIMARY KEY,
    title             VARCHAR(200) NOT NULL,
    description       TEXT,
    content_type_id   INT REFERENCES content_type(content_type_id),
    target_user_group VARCHAR(50),
    mood_tag_id       INT REFERENCES mood_type(mood_type_id),
    reference_url     TEXT,
    status            VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_date      DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ── Content Rating (depends on content, user) ────────────────

CREATE TABLE content_rating (
    rating_id     SERIAL PRIMARY KEY,
    content_id    INT REFERENCES content(content_id),
    user_id       INT REFERENCES "user"(user_id),
    rating_value  INT CHECK (rating_value BETWEEN 1 AND 5),
    rated_date    DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ── Bookmark (depends on user, content) ──────────────────────

CREATE TABLE bookmark (
    bookmark_id      SERIAL PRIMARY KEY,
    user_id          INT REFERENCES "user"(user_id),
    content_id       INT REFERENCES content(content_id),
    bookmarked_date  DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(user_id, content_id)
);

-- ── Analytics Snapshot (depends on institution) ──────────────

CREATE TABLE analytics_snapshot (
    snapshot_id                SERIAL PRIMARY KEY,
    institution_id             INT REFERENCES institution(institution_id),
    snapshot_date              DATE NOT NULL,
    total_active_logins        INT DEFAULT 0,
    aggregate_mood_index       DECIMAL(4,2),
    total_escalations_triggered INT DEFAULT 0,
    content_engagement_rate    DECIMAL(5,2)
);

-- ── Report Export Log (depends on staff_profile) ─────────────

CREATE TABLE report_export_log (
    export_id        SERIAL PRIMARY KEY,
    staff_id         INT REFERENCES staff_profile(staff_id),
    export_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    report_type      VARCHAR(100) NOT NULL,
    format_used      VARCHAR(10) NOT NULL
);

-- ── Wellness Check-In (depends on user) ──────────────────────

CREATE TABLE check_in (
    id              SERIAL PRIMARY KEY,
    user_id         INT REFERENCES "user"(user_id) ON DELETE CASCADE,
    transcript      TEXT NOT NULL,
    summary         TEXT NOT NULL,
    mood            VARCHAR(50) NOT NULL,
    stress          VARCHAR(50) NOT NULL,
    energy          VARCHAR(50) NOT NULL,
    confidence      VARCHAR(20) NOT NULL,
    observations    JSONB NOT NULL DEFAULT '[]',
    suggestions     JSONB NOT NULL DEFAULT '[]',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SEED DATA — lookup tables
-- ============================================================

INSERT INTO user_type (user_type_name) VALUES
    ('Student'), ('Elderly'), ('Depression Patient');

INSERT INTO mood_type (mood_name, mood_score) VALUES
    ('Happy',9), ('Calm',7), ('Anxious',4),
    ('Sad',3), ('Angry',3), ('Depressed',1);

INSERT INTO trigger_type (trigger_name) VALUES
    ('Work'),('Family'),('Health'),
    ('Social'),('Academic'),('Financial'),('Other');

INSERT INTO risk_level (level_name, score_range, action_required) VALUES
    ('Low',     '0-25',  'Monitor'),
    ('Medium',  '26-50', 'Alert Caregiver'),
    ('High',    '51-75', 'Escalate to Therapist'),
    ('Critical','76-100','Emergency Protocol');

INSERT INTO alert_type (type_name, default_severity, auto_escalate) VALUES
    ('Mood Drop',       'High',     true),
    ('Inactivity',      'Medium',   false),
    ('Distress Keyword','High',     true),
    ('SOS',             'Critical', true),
    ('Risk Threshold',  'High',     true);

INSERT INTO response_category (category_name) VALUES
    ('Motivational'),('CBT'),('Crisis'),
    ('Breathing Exercise'),('General Support');

INSERT INTO content_type (type_name) VALUES
    ('Article'),('Breathing Exercise'),
    ('Meditation'),('CBT Exercise');

INSERT INTO ai_configuration
    (user_type_id, response_tone, distress_keyword_list, escalation_threshold_score)
VALUES
    (1, 'Friendly', 'hopeless,worthless,end it,hurt myself,suicidal', 3.0),
    (2, 'Gentle',   'hopeless,worthless,end it,hurt myself,suicidal', 3.0),
    (3, 'Formal',   'hopeless,worthless,end it,hurt myself,suicidal', 2.5);