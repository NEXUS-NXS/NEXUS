#!/usr/bin/env python3
"""
Simple test script to check if there are models in the database and create some sample data if needed.
"""

import os
import sys

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), 'nexus-backend')
sys.path.insert(0, backend_path)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from simulations.models import Model, Dataset
from django.contrib.auth import get_user_model

User = get_user_model()

def main():
    # Check if we have any models
    models_count = Model.objects.count()
    datasets_count = Dataset.objects.count()
    users_count = User.objects.count()
    
    print(f"Current database state:")
    print(f"  Users: {users_count}")
    print(f"  Models: {models_count}")
    print(f"  Datasets: {datasets_count}")
    
    # If no models exist, create some sample data
    if models_count == 0:
        print("\nNo models found. Creating sample data...")
        
        # Get or create a test user
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'test@example.com',
                'first_name': 'Test',
                'last_name': 'User'
            }
        )
        if created:
            user.set_password('testpass123')
            user.save()
            print(f"Created test user: {user.username}")
        else:
            print(f"Using existing user: {user.username}")
        
        # Create sample models
        sample_models = [
            {
                'name': 'Life Insurance Premium Calculator',
                'category': 'actuarial',
                'language': 'python',
                'code': '''
def calculate_premium(age, gender, smoker, coverage_amount):
    base_rate = 0.001
    if smoker:
        base_rate *= 2.5
    if gender == 'male':
        base_rate *= 1.1
    age_factor = 1 + ((age - 25) * 0.02)
    return coverage_amount * base_rate * age_factor
''',
                'metadata': {
                    'description': 'Calculate life insurance premiums based on risk factors',
                    'version': '1.0',
                    'parameters': ['age', 'gender', 'smoker', 'coverage_amount']
                }
            },
            {
                'name': 'Climate Risk Assessment',
                'category': 'climate',
                'language': 'python',
                'code': '''
import numpy as np

def assess_climate_risk(temperature_change, precipitation_change, sea_level_rise):
    risk_score = 0
    risk_score += abs(temperature_change) * 10
    risk_score += abs(precipitation_change - 1) * 20
    risk_score += sea_level_rise * 50
    return min(risk_score, 100)
''',
                'metadata': {
                    'description': 'Assess climate-related risks for insurance portfolios',
                    'version': '1.0',
                    'parameters': ['temperature_change', 'precipitation_change', 'sea_level_rise']
                }
            },
            {
                'name': 'Portfolio Optimization Model',
                'category': 'financial',
                'language': 'python',
                'code': '''
import numpy as np
from scipy.optimize import minimize

def optimize_portfolio(returns, risk_tolerance):
    n_assets = len(returns)
    weights = np.ones(n_assets) / n_assets
    
    def objective(w):
        portfolio_return = np.sum(w * returns)
        portfolio_risk = np.sum(w ** 2)  # Simplified risk model
        return -(portfolio_return - risk_tolerance * portfolio_risk)
    
    constraints = [{'type': 'eq', 'fun': lambda w: np.sum(w) - 1}]
    bounds = [(0, 1) for _ in range(n_assets)]
    
    result = minimize(objective, weights, bounds=bounds, constraints=constraints)
    return result.x
''',
                'metadata': {
                    'description': 'Optimize investment portfolio allocation',
                    'version': '1.0',
                    'parameters': ['returns', 'risk_tolerance']
                }
            }
        ]
        
        for model_data in sample_models:
            model = Model.objects.create(
                owner=user,
                **model_data
            )
            print(f"Created model: {model.name}")
        
        print(f"\nCreated {len(sample_models)} sample models")
    
    # List all models
    print("\nExisting models:")
    for model in Model.objects.all():
        print(f"  - {model.name} (Category: {model.category}, Language: {model.language}, Owner: {model.owner.username})")

if __name__ == '__main__':
    main()
