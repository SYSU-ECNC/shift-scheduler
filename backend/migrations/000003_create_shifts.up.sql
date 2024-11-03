CREATE TABLE IF NOT EXISTS shifts_meta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_template_id UUID NOT NULL REFERENCES shifts_templates_metas (id),
    submission_start TIMESTAMPTZ NOT NULL,
    submission_end TIMESTAMPTZ NOT NULL,
    active_start TIMESTAMPTZ NOT NULL,
    active_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);