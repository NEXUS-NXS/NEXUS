from django.contrib import admin
from .models import Certificate, UserCertificate

class CertificateAdmin(admin.ModelAdmin):
    list_display = ('title', 'issuer', 'certificate_type', 'created_at')
    list_filter = ('certificate_type', 'issuer')
    search_fields = ('title', 'description', 'issuer')
    readonly_fields = ('created_at', 'updated_at')

class UserCertificateAdmin(admin.ModelAdmin):
    list_display = ('user', 'certificate', 'status', 'issue_date', 'expiry_date')
    list_filter = ('status', 'certificate__certificate_type')
    search_fields = ('user__username', 'certificate__title', 'certificate__issuer')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('user', 'certificate')

admin.site.register(Certificate, CertificateAdmin)
admin.site.register(UserCertificate, UserCertificateAdmin)
