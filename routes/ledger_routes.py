from flask import Blueprint, request, jsonify
from models import db, LedgerEntry
from datetime import datetime

ledger_bp = Blueprint('ledger_bp', __name__, url_prefix='/api/admin/ledger')

@ledger_bp.route('/add', methods=['POST'])
def add_ledger_entry():
    data = request.get_json()

    try:
        new_entry = LedgerEntry(
            type=data['type'],  # 'credit' or 'debit'
            amount=float(data['amount']),
            source=data['source'],
            description=data.get('description', ''),
            transaction_id=data['transaction_id'],
            date=datetime.fromisoformat(data['date'])
        )
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Ledger entry added successfully'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 400
