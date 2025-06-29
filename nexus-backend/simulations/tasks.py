from celery import shared_task
from simulations.engine import SimulationEngine
from simulations.models import Simulation

@shared_task(bind=True)
def run_simulation_task(self, simulation_id):
    simulation = Simulation.objects.get(session_id=simulation_id)
    engine = SimulationEngine(simulation)
    errors = engine.validate()
    if errors:
        simulation.status = 'failed'
        simulation.save()
        Result.objects.create(
            simulation=simulation,
            errors=errors
        )
        return
    engine.run()