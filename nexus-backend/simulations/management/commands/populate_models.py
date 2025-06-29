from django.core.management.base import BaseCommand
from simulations.models import Model
from django.contrib.auth import get_user_model
User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the model library with actuarial models'

    def handle(self, *args, **kwargs):
        admin_user = User.objects.filter(username='admin').first()
        if not admin_user:
            self.stdout.write(self.style.ERROR('Admin user not found. Please create a user with username "admin"'))
            return
        models = [
            {
                'name': 'Chain-Ladder Model',
                'category': 'actuarial',
                'language': 'r',
                'code': '''
library(actuar)
run_simulation <- function() {
  data <- dataset  # Expects a claims triangle (matrix)
  if (is.null(data)) {
    data <- matrix(c(1000, 1200, 1300, 800, 900, 0, 600, 0, 0), nrow=3, byrow=TRUE)
  }
  cl <- chainladder(data)
  reserves <- predict(cl)$prediction
  list(
    data=reserves,
    metrics=list(total_reserve=sum(reserves, na.rm=TRUE)),
    chart_data=list(line=cbind(1:length(reserves), reserves))
  )
}
                ''',
                'metadata': {'description': 'Estimates reserves using the chain-ladder method'},
            },
            {
                'name': 'Stochastic Loss Distribution',
                'category': 'actuarial',
                'language': 'python',
                'code': '''
import numpy as np
def run_simulation():
    n_simulations = parameters.get('n_simulations', 1000)
    lambda_freq = parameters.get('lambda_freq', 10)
    shape_sev = parameters.get('shape_sev', 2.0)
    scale_sev = parameters.get('scale_sev', 1000)
    freq = np.random.poisson(lambda_freq, n_simulations)
    losses = [np.sum(np.random.gamma(shape_sev, scale_sev, f)) for f in freq]
    return {
        'data': losses,
        'metrics': {'mean_loss': np.mean(losses), 'std_loss': np.std(losses)},
        'chart_data': {'histogram': np.histogram(losses, bins=30)[0].tolist()}
    }
                ''',
                'metadata': {'description': 'Simulates losses using Poisson frequency and Gamma severity'},
            },
            {
                'name': 'Mortality Projection',
                'category': 'actuarial',
                'language': 'python',
                'code': '''
import numpy as np
import lifelib
def run_simulation():
    life_table = dataset if dataset is not None else lifelib.load_standard_table('S1PMA')
    ages = parameters.get('ages', range(20, 100))
    mortality_rates = [life_table.q_x(age) for age in ages]
    return {
        'data': mortality_rates,
        'metrics': {'avg_mortality': np.mean(mortality_rates)},
        'chart_data': {'line': list(zip(ages, mortality_rates))}
    }
                ''',
                'metadata': {'description': 'Projects mortality rates using a life table'},
            },
            {
                'name': 'Cash Flow Projection',
                'category': 'actuarial',
                'language': 'dsl',
                'code': '''
{
  "type": "cashflow",
  "steps": [
    {"type": "payment", "amount": 1000},
    {"type": "discount", "rate": 0.05, "periods": 1},
    {"type": "payment", "amount": 500},
    {"type": "discount", "rate": 0.05, "periods": 1}
  ]
}
                ''',
                'metadata': {'description': 'Projects cash flows for life insurance premiums/reserves'},
            },
            {
                'name': 'Value at Risk',
                'category': 'actuarial',
                'language': 'python',
                'code': '''
import numpy as np
from scipy import stats
def run_simulation():
    data = dataset.values.flatten() if dataset is not None else np.random.normal(100, 10, 1000)
    confidence_level = parameters.get('confidence_level', 0.95)
    var = np.percentile(data, (1 - confidence_level) * 100)
    return {
        'data': data.tolist(),
        'metrics': {'var': float(var), 'mean': np.mean(data)},
        'chart_data': {'histogram': np.histogram(data, bins=30)[0].tolist()}
    }
                ''',
                'metadata': {'description': 'Calculates Value at Risk for a loss distribution'},
            }
        ]

        for model_data in models:
            Model.objects.get_or_create(
                name=model_data['name'],
                defaults={
                    'category': model_data['category'],
                    'language': model_data['language'],
                    'code': model_data['code'],
                    'metadata': model_data['metadata'],
                    'owner': admin_user
                }
            )
        self.stdout.write(self.style.SUCCESS('Successfully populated actuarial models'))