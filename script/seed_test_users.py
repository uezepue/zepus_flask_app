import click
from flask.cli import with_appcontext
from models import db, Patient, Doctor, Admin

@click.command('seed-test-users')
@with_appcontext
def seed_test_users():
    # Clear existing test users
    Patient.query.filter(Patient.email.like('%@test.com')).delete()
    Doctor.query.filter(Doctor.email.like('%@test.com')).delete()
    Admin.query.filter(Admin.email.like('%@zepus.test')).delete()
    db.session.commit()

    # Add test patient
    patient = Patient(
        first_name='Test',
        last_name='Patient',
        age=30,
        dob='1995-01-01',
        sex='Male',
        occupation='Tester',
        marital_status='Single',
        address='123 Test Lane',
        city='Lagos',
        country='Nigeria',
        tribe='Igbo',
        race='Black',
        religion='Christianity',
        phone='08012345678',
        email='patient@test.com'
    )
    patient.set_password('password123')

    # Add test doctor
    doctor = Doctor(
        name='Dr. Test Doctor',
        specialty='General Surgery',
        bio='I test things.',
        phone='08098765432',
        email='doctor@test.com',
        consultation_fee=1000,
        is_verified=True
    )
    doctor.set_password('password123')

    # Add test admins
    admin_high = Admin(name='Admin High', email='high@zepus.test')
    admin_mid = Admin(name='Admin Mid', email='mid@zepus.test')
    admin_low = Admin(name='Admin Low', email='low@zepus.test')

    for admin in [admin_high, admin_mid, admin_low]:
        admin.set_password('adminpass')

    # Assign levels manually if the model supports it
    setattr(admin_high, 'clearance_level', 'high')
    setattr(admin_mid, 'clearance_level', 'mid')
    setattr(admin_low, 'clearance_level', 'low')
    setattr(admin_high, 'assigned_department', 'Security')
    setattr(admin_mid, 'assigned_department', 'Triage')
    setattr(admin_low, 'assigned_department', 'Doctors')

    # Commit all
    db.session.add_all([patient, doctor, admin_high, admin_mid, admin_low])
    db.session.commit()

    click.echo('Test users created successfully.')
