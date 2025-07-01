#!/bin/bash
echo "Building frontend..."
npm run build
echo "Starting Flask app..."
python app.py
