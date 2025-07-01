# routes/__init__.py
# Makes the routes folder a Python module

from scripts.seed_test_users import seed_test_users
app.cli.add_command(seed_test_users)
