from django.apps import AppConfig


class LearnhubConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'learnhub'

    def ready(self):
        import learnhub.signals