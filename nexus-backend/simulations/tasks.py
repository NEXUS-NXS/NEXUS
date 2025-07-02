from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from simulations.engine import SimulationEngine
from simulations.models import Simulation, Result
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def notify_progress(session_id, data):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"simulation_{session_id}",
        {"type": "simulation.update", "data": data}
    )

@shared_task(bind=True)
def run_simulation_task(self, simulation_id):
    try:
        simulation = Simulation.objects.get(session_id=simulation_id)

        # Step 1: Start
        simulation.status = 'running'
        simulation.start_time = timezone.now()
        simulation.current_step = 'Starting simulation...'
        simulation.progress = 5
        simulation.estimated_completion = timezone.now() + timedelta(minutes=2)
        simulation.save()

        notify_progress(simulation_id, {
            "status": simulation.status,
            "progress": simulation.progress,
            "current_step": simulation.current_step,
        })

        engine = SimulationEngine(simulation)

        # Step 2: Validation
        simulation.current_step = 'Validating model...'
        simulation.progress = 15
        simulation.save()

        notify_progress(simulation_id, {
            "status": simulation.status,
            "progress": simulation.progress,
            "current_step": simulation.current_step,
        })

        errors = engine.validate()
        if errors:
            simulation.status = 'failed'
            simulation.current_step = 'Validation failed.'
            simulation.progress = 100
            simulation.save()
            notify_progress(simulation_id, {
                "status": simulation.status,
                "progress": simulation.progress,
                "current_step": simulation.current_step,
            })
            Result.objects.create(simulation=simulation, errors=errors)
            return

        # Step 3: Initialization
        simulation.current_step = 'Initializing simulation...'
        simulation.progress = 30
        simulation.save()

        notify_progress(simulation_id, {
            "status": simulation.status,
            "progress": simulation.progress,
            "current_step": simulation.current_step,
        })

        # Step 4: Run logic
        simulation.current_step = 'Running model logic...'
        simulation.progress = 60
        simulation.save()

        notify_progress(simulation_id, {
            "status": simulation.status,
            "progress": simulation.progress,
            "current_step": simulation.current_step,
        })

        engine.run()

        # Step 5: Finalize
        simulation.current_step = 'Finalizing results...'
        simulation.progress = 85
        simulation.save()

        notify_progress(simulation_id, {
            "status": simulation.status,
            "progress": simulation.progress,
            "current_step": simulation.current_step,
        })

        simulation.current_step = 'Simulation complete.'
        simulation.status = 'completed'
        simulation.progress = 100
        simulation.save()

        notify_progress(simulation_id, {
            "status": simulation.status,
            "progress": simulation.progress,
            "current_step": simulation.current_step,
        })

    except Simulation.DoesNotExist:
        self.retry(exc=Exception("Simulation not found"), countdown=10, max_retries=3)

    except Exception as e:
        simulation.status = 'failed'
        simulation.current_step = 'Error occurred.'
        simulation.progress = 100
        simulation.save()
        notify_progress(simulation_id, {
            "status": simulation.status,
            "progress": simulation.progress,
            "current_step": simulation.current_step,
        })
        Result.objects.create(simulation=simulation, errors={'message': str(e)})
