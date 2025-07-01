from flask import Blueprint, request, jsonify
from models import db, LedgerEntry
from datetime import datetime

import os

bank_bp = Blueprint('bank_bp', __name__, url_prefix='/api/bank')

@bank_bp.route('/webhook', methods=['POST'])
def mono_webhook():
    payload = request.get_json()

    try:
        tx = payload.get('data', {})

        # Filter valid transaction types only
        if tx.get('type') not in ['credit', 'debit']:
            return jsonify({'status': 'ignored', 'message': 'Not a credit or debit transaction'}), 200

        # Prevent duplicates
        existing = LedgerEntry.query.filter_by(transaction_id=tx['transaction_reference']).first()
        if existing:
            return jsonify({'status': 'duplicate', 'message': 'Transaction already recorded'}), 200

        # Create new ledger entry
        entry = LedgerEntry(
            type=tx['type'],
            amount=tx['amount'] / 100,  # Convert from kobo to Naira
            source='bank_sync',
            description=tx.get('narration', 'Bank webhook transaction'),
            transaction_id=tx['transaction_reference'],
            date=datetime.fromisoformat(tx['date'])
        )

        db.session.add(entry)
        db.session.commit()

        return jsonify({'status': 'success', 'message': 'Transaction recorded'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 400
