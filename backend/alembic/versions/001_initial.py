"""Initial schema

Revision ID: 001_initial
Revises: 
Create Date: 2024-12-04
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone_number', sa.String(20), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('role', sa.Enum('PATIENT', 'DOCTOR', 'RECEPTIONIST', 'ADMIN', name='userrole'), nullable=False, server_default='PATIENT'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.Column('mfa_enabled', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('mfa_secret', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_users'),
        sa.UniqueConstraint('email', name='uq_users_email'),
        sa.UniqueConstraint('phone_number', name='uq_users_phone_number'),
    )
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_phone_number', 'users', ['phone_number'])

    # Patients table
    op.create_table('patients',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('date_of_birth', sa.Date(), nullable=False),
        sa.Column('medical_history', sa.Text(), nullable=True),
        sa.Column('allergies', sa.Text(), nullable=True),
        sa.Column('medications', postgresql.JSONB(), nullable=True),
        sa.Column('emergency_contact', sa.String(255), nullable=True),
        sa.Column('preferred_contact_method', sa.String(20), server_default='sms'),
        sa.Column('sms_consent', sa.Boolean(), server_default='true'),
        sa.Column('email_consent', sa.Boolean(), server_default='true'),
        sa.Column('call_consent', sa.Boolean(), server_default='true'),
        sa.Column('encrypted_fields', postgresql.JSONB(), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_patients'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('user_id', name='uq_patients_user_id'),
    )
    op.create_index('ix_patients_user_id', 'patients', ['user_id'])

    # Doctors table
    op.create_table('doctors',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('first_name', sa.String(255), nullable=False),
        sa.Column('last_name', sa.String(255), nullable=False),
        sa.Column('specialization', sa.String(255), nullable=False),
        sa.Column('license_number', sa.String(255), nullable=False),
        sa.Column('phone_number', sa.String(20), nullable=False),
        sa.Column('working_hours', postgresql.JSONB(), nullable=False),
        sa.Column('buffer_time_minutes', sa.Integer(), server_default='15'),
        sa.Column('appointment_duration_minutes', sa.Integer(), server_default='30'),
        sa.Column('max_patients_per_day', sa.Integer(), server_default='20'),
        sa.Column('clinic_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('office_location', sa.String(500), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_doctors'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('user_id', name='uq_doctors_user_id'),
        sa.UniqueConstraint('license_number', name='uq_doctors_license_number'),
    )
    op.create_index('ix_doctors_specialization', 'doctors', ['specialization'])
    op.create_index('ix_doctors_clinic_id', 'doctors', ['clinic_id'])

    # Appointments table
    op.create_table('appointments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('doctor_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('start_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('end_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('status', sa.String(20), server_default='scheduled'),
        sa.Column('appointment_type', sa.String(50), server_default='general'),
        sa.Column('reason_for_visit', sa.Text(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('confirmed_by_patient', sa.Boolean(), server_default='false'),
        sa.Column('confirmed_by_doctor', sa.Boolean(), server_default='false'),
        sa.Column('last_reminder_sent_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('no_show_recorded_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cancellation_reason', sa.String(255), nullable=True),
        sa.Column('cancellation_initiator', sa.String(20), nullable=True),
        sa.Column('is_virtual', sa.Boolean(), server_default='false'),
        sa.Column('video_call_link', sa.String(500), nullable=True),
        sa.Column('confirmation_code', sa.String(20), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_appointments'),
        sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['doctor_id'], ['doctors.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('doctor_id', 'start_time', name='uq_doctor_start_time'),
        sa.UniqueConstraint('confirmation_code', name='uq_appointments_confirmation_code'),
        sa.CheckConstraint('end_time > start_time', name='ck_appointments_valid_time_range'),
    )
    op.create_index('ix_appointments_patient_id', 'appointments', ['patient_id'])
    op.create_index('ix_appointments_doctor_id', 'appointments', ['doctor_id'])
    op.create_index('ix_appointments_start_time', 'appointments', ['start_time'])
    op.create_index('ix_appointments_status', 'appointments', ['status'])
    op.create_index('ix_appointments_confirmation_code', 'appointments', ['confirmation_code'])

    # Notifications table
    op.create_table('notifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('appointment_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('type', sa.String(20), nullable=False),
        sa.Column('channel', sa.String(50), nullable=True),
        sa.Column('recipient_address', sa.String(255), nullable=False),
        sa.Column('message_template', sa.String(255), nullable=True),
        sa.Column('message_body', sa.Text(), nullable=True),
        sa.Column('scheduled_for', sa.DateTime(timezone=True), nullable=True),
        sa.Column('sent_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('delivered_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('status', sa.String(20), server_default='scheduled'),
        sa.Column('delivery_attempts', sa.Integer(), server_default='0'),
        sa.Column('max_retries', sa.Integer(), server_default='3'),
        sa.Column('failure_reason', sa.String(500), nullable=True),
        sa.Column('last_error_code', sa.String(50), nullable=True),
        sa.Column('opened_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('clicked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_notifications'),
        sa.ForeignKeyConstraint(['appointment_id'], ['appointments.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_notifications_patient_id', 'notifications', ['patient_id'])
    op.create_index('ix_notifications_appointment_id', 'notifications', ['appointment_id'])
    op.create_index('ix_notifications_status', 'notifications', ['status'])
    op.create_index('ix_notifications_scheduled_for', 'notifications', ['scheduled_for'])

    # Voice call records table
    op.create_table('voice_call_records',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('appointment_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('patient_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('call_sid', sa.String(255), nullable=False),
        sa.Column('call_type', sa.String(20), nullable=True),
        sa.Column('phone_number', sa.String(20), nullable=False),
        sa.Column('recording_url', sa.String(500), nullable=True),
        sa.Column('transcript', sa.Text(), nullable=True),
        sa.Column('transcription_confidence', sa.Numeric(3, 2), nullable=True),
        sa.Column('detected_intent', sa.String(50), nullable=True),
        sa.Column('conversation_outcome', sa.String(50), nullable=True),
        sa.Column('call_started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('call_ended_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('call_duration_seconds', sa.Integer(), nullable=True),
        sa.Column('livekit_session_id', sa.String(255), nullable=True),
        sa.Column('ai_model_version', sa.String(50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id', name='pk_voice_call_records'),
        sa.ForeignKeyConstraint(['appointment_id'], ['appointments.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('call_sid', name='uq_voice_call_records_call_sid'),
    )
    op.create_index('ix_voice_call_records_patient_id', 'voice_call_records', ['patient_id'])
    op.create_index('ix_voice_call_records_appointment_id', 'voice_call_records', ['appointment_id'])
    op.create_index('ix_voice_call_records_call_sid', 'voice_call_records', ['call_sid'])
    op.create_index('ix_voice_call_records_call_started_at', 'voice_call_records', ['call_started_at'])

    # Audit logs table
    op.create_table('audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('resource_type', sa.String(50), nullable=True),
        sa.Column('resource_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('performed_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('old_values', postgresql.JSONB(), nullable=True),
        sa.Column('new_values', postgresql.JSONB(), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('contains_phi', sa.Boolean(), server_default='true'),
        sa.PrimaryKeyConstraint('id', name='pk_audit_logs'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
    )
    op.create_index('ix_audit_logs_performed_at', 'audit_logs', ['performed_at'])
    op.create_index('ix_audit_logs_user_id', 'audit_logs', ['user_id'])
    op.create_index('ix_audit_logs_resource_id', 'audit_logs', ['resource_id'])
    op.create_index('ix_audit_logs_action', 'audit_logs', ['action'])


def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('voice_call_records')
    op.drop_table('notifications')
    op.drop_table('appointments')
    op.drop_table('doctors')
    op.drop_table('patients')
    op.drop_table('users')
