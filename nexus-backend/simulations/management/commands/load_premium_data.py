import csv
from django.contrib.auth import get_user_model
User = get_user_model()
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings
from simulations.models import Dataset

class Command(BaseCommand):
    help = "Load premium data CSV into the Dataset model"

    def handle(self, *args, **options):
        csv_path = Path(settings.BASE_DIR) / "premium data.csv"
        if not csv_path.exists():
            self.stderr.write(f"File not found: {csv_path}")
            return

        admin_user = User.objects.filter(username='admin').first()
        if not admin_user:
            self.stderr.write("Admin user not found. Please create one with username='admin'")
            return

        ds, created = Dataset.objects.get_or_create(
            name="Premium UPR by Policy Class",
            defaults={
                "file_path": str(csv_path),
                "metadata": {"description": "UPR sums by policy class"},
                "owner": admin_user,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f"Imported dataset: {ds.name}"))
        else:
            self.stdout.write(f"Dataset already exists: {ds.name}")
