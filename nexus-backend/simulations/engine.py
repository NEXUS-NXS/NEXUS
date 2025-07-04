import uuid
import pandas as pd
import numpy as np
from RestrictedPython import compile_restricted, safe_globals
from simulations.models import Simulation, Result
import json
from scipy import stats

# Optional rpy2 imports
try:
    import rpy2.robjects as ro
    from rpy2.robjects import pandas2ri
    RPY2_AVAILABLE = True
except ImportError:
    ro = None
    pandas2ri = None
    RPY2_AVAILABLE = False

class SimulationEngine:
    def __init__(self, simulation):
        self.simulation = simulation
        self.model = simulation.model
        self.parameters = simulation.parameters
        self.dataset = simulation.dataset

    def validate(self):
        """Advanced validation for model, parameters, and dataset."""
        errors = {}
        
        # Model validation
        if not self.model.code:
            errors['code'] = 'Model code is empty'
        if self.model.language not in ['python', 'r', 'dsl']:
            errors['language'] = f'Unsupported language: {self.model.language}'

        # Language-specific validation
        if self.model.language == 'python':
            try:
                compile_restricted(self.model.code, '<string>', 'exec')
            except SyntaxError as e:
                errors['code'] = f'Python syntax error: {str(e)}'
            if 'run_simulation' not in self.model.code:
                errors['code'] = 'Python model must define run_simulation function'
        
        elif self.model.language == 'r':
            try:
                ro.r(self.model.code)
            except Exception as e:
                errors['code'] = f'R syntax error: {str(e)}'
            if 'run_simulation' not in self.model.code:
                errors['code'] = 'R model must define run_simulation function'
        
        elif self.model.language == 'dsl':
            try:
                dsl = json.loads(self.model.code)
                if not isinstance(dsl, dict) or 'type' not in dsl or 'steps' not in dsl:
                    errors['code'] = 'Invalid DSL format: must be JSON with type and steps'
                if dsl.get('type') not in ['cashflow', 'monte_carlo']:
                    errors['type'] = f'Unsupported DSL type: {dsl.get("type")}'
            except json.JSONDecodeError:
                errors['code'] = 'Invalid DSL JSON'

        # Model-Specific Parameter Validation
        if self.model.name == 'Chain-Ladder Model':
            if self.dataset:
                try:
                    df = pd.read_csv(self.dataset.file_path)
                    if df.shape[0] < 2 or df.shape[1] < 2:
                        errors['dataset'] = 'Chain-Ladder requires a triangular matrix'
                except:
                    errors['dataset'] = 'Invalid claims triangle dataset'
        
        elif self.model.name == 'Stochastic Loss Distribution':
            if 'lambda_freq' not in self.parameters or self.parameters['lambda_freq'] <= 0:
                errors['lambda_freq'] = 'Positive lambda_freq required'
            if 'shape_sev' not in self.parameters or self.parameters['shape_sev'] <= 0:
                errors['shape_sev'] = 'Positive shape_sev required'
            if 'scale_sev' not in self.parameters or self.parameters['scale_sev'] <= 0:
                errors['scale_sev'] = 'Positive scale_sev required'
        
        elif self.model.name == 'Mortality Projection':
            if 'ages' not in self.parameters:
                errors['ages'] = 'List of ages required'
            if self.dataset and 'q_x' not in pd.read_csv(self.dataset.file_path).columns:
                errors['dataset'] = 'Dataset must include q_x (mortality rates)'
        
        elif self.model.name == 'Cash Flow Projection':
            if 'initial_value' not in self.parameters:
                errors['initial_value'] = 'Initial value required'
        
        elif self.model.name == 'Value at Risk':
            if 'confidence_level' not in self.parameters or not (0 < self.parameters['confidence_level'] < 1):
                errors['confidence_level'] = 'Confidence level must be between 0 and 1'

        # Dataset validation
        if self.dataset:
            try:
                df = pd.read_csv(self.dataset.file_path)
                if df.empty:
                    errors['dataset'] = 'Dataset is empty'
            except Exception as e:
                errors['dataset'] = f'Invalid dataset: {str(e)}'

        return errors if errors else None

    def run(self):
        """Run the simulation and store results."""
        self.simulation.status = 'running'
        self.simulation.progress = 0.0
        self.simulation.current_step = 'Initializing'
        self.simulation.save()

        try:
            if self.model.language == 'python':
                result = self._run_python()
            elif self.model.language == 'r':
                result = self._run_r()
            elif self.model.language == 'dsl':
                result = self._run_dsl()
            else:
                raise ValueError("Unsupported model language")

            self.simulation.status = 'completed'
            self.simulation.progress = 100.0
            self.simulation.current_step = 'Completed'
            self.simulation.save()
            Result.objects.create(
                simulation=self.simulation,
                summary=f"Simulation completed for {self.model.name}",
                metrics=result['metrics'],
                chart_data=result['chart_data'],
            )
        except Exception as e:
            self.simulation.status = 'failed'
            self.simulation.current_step = 'Failed'
            self.simulation.save()
            Result.objects.create(
                simulation=self.simulation,
                errors={'code': 'EXEC_ERROR', 'message': str(e)}
            )
            raise

    def _run_python(self):
        """Execute Python model in a sandboxed environment."""
        globals_dict = safe_globals.copy()
        locals_dict = {}
        globals_dict['pd'] = pd
        globals_dict['np'] = np
        globals_dict['lifelib'] = lifelib
        globals_dict['parameters'] = self.parameters
        if self.dataset:
            globals_dict['dataset'] = pd.read_csv(self.dataset.file_path)

        code = compile_restricted(self.model.code, '<string>', 'exec')
        exec(code, globals_dict, locals_dict)

        if 'run_simulation' not in locals_dict:
            raise ValueError("Model must define 'run_simulation' function")

        result = locals_dict['run_simulation']()
        return self._process_results(result)

    def _run_r(self):
        """Execute R model using rpy2."""
        pandas2ri.activate()
        ro.globalenv['parameters'] = self.parameters
        if self.dataset:
            ro.globalenv['dataset'] = pd.read_csv(self.dataset.file_path)
        
        ro.r('library(actuar)')
        ro.r(self.model.code)
        result = ro.r['run_simulation']()
        
        if isinstance(result, dict):
            result_dict = dict(result)
        else:
            result_dict = {'data': list(result)}
        
        return self._process_results(result_dict)

    def _run_dsl(self):
        """Execute DSL-based model."""
        dsl = json.loads(self.model.code)
        model_type = dsl.get('type')
        steps = dsl.get('steps', [])
        
        data = []
        if self.dataset:
            data = pd.read_csv(self.dataset.file_path).values.flatten()
        
        if model_type == 'cashflow':
            result = self._run_cashflow_dsl(steps)
        elif model_type == 'monte_carlo':
            result = self._run_monte_carlo_dsl(steps, data)
        else:
            raise ValueError(f"Unsupported DSL type: {model_type}")
        
        return self._process_results(result)

    def _run_cashflow_dsl(self, steps):
        """Execute a cashflow DSL model."""
        cashflows = []
        current_value = self.parameters.get('initial_value', 0)
        for i, step in enumerate(steps):
            if step['type'] == 'payment':
                current_value += step['amount']
            elif step['type'] == 'discount':
                current_value *= (1 + step['rate']) ** (-step['periods'])
            cashflows.append(current_value)
            self.simulation.progress = (i + 1) * 100.0 / len(steps)
            self.simulation.current_step = f"Step: {step['type']}"
            self.simulation.save()
        
        return {
            'data': cashflows,
            'metrics': {'final_value': current_value, 'pv': cashflows[-1]},
            'chart_data': {'line': list(enumerate(cashflows))}
        }

    def _run_monte_carlo_dsl(self, steps, data):
        """Execute a Monte Carlo DSL model."""
        n_simulations = self.parameters.get('n_simulations', 1000)
        results = []
        for i in range(n_simulations):
            value = data[i % len(data)] if data else np.random.normal(
                self.parameters.get('mean', 100),
                self.parameters.get('std_dev', 10)
            )
            for step in steps:
                if step['type'] == 'scale':
                    value *= step['factor']
            results.append(value)
            self.simulation.progress = (i + 1) * 100.0 / n_simulations
            self.simulation.current_step = 'Running Monte Carlo iteration'
            self.simulation.save()
        
        return {
            'data': results,
            'metrics': {'mean': np.mean(results), 'std_dev': np.std(results)},
            'chart_data': {'histogram': np.histogram(results, bins=30)[0].tolist()}
        }

    def _process_results(self, result):
        """Generate summary statistics, actuarial risk metrics, and chart data."""
        data = np.array(result.get('data', []), dtype=float)
        metrics = result.get('metrics', {})
        chart_data = result.get('chart_data', {})

        if len(data) > 1:
            # Update metrics
            metrics.update({
                'mean': float(np.mean(data)),
                'median': float(np.median(data)),
                'std_dev': float(np.std(data)),
                'min': float(np.min(data)),
                'max': float(np.max(data))
            })
            
            # Actuarial risk metrics
            risk_free_rate = self.parameters.get('risk_free_rate', 0.0)
            returns = np.diff(data) / data[:-1] if len(data) > 1 else [0]
            sharpe_ratio = (np.mean(returns) - risk_free_rate) / np.std(returns) * np.sqrt(252) if np.std(returns) != 0 else 0
            metrics['sharpe_ratio'] = float(sharpe_ratio)
            
            peak = np.maximum.accumulate(data)
            drawdowns = (peak - data) / peak
            metrics['max_drawdown'] = float(np.max(drawdowns))
            
            # Value at Risk (if not already calculated)
            if 'var' not in metrics:
                confidence_level = self.parameters.get('confidence_level', 0.95)
                metrics['var'] = float(np.percentile(data, (1 - confidence_level) * 100))
        
        # Update chart data
        if not chart_data:
            chart_data = {
                'line': list(enumerate(data.tolist())),
                'histogram': np.histogram(data, bins=30)[0].tolist(),
                'scatter': [[i, v] for i, v in enumerate(data)] if len(data) < 1000 else []
            }
        
        return {'metrics': metrics, 'chart_data': chart_data}