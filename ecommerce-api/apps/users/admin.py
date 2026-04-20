from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Perfil'
    fields = [
        'street', 'number', 'complement', 'neighborhood',
        'city', 'state', 'zip_code', 'country',
        'birth_date', 'avatar', 'newsletter',
    ]


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = [UserProfileInline]
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_staff', 'created_at']
    list_filter = ['is_staff', 'is_superuser', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informacoes adicionais', {'fields': ('phone',)}),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'city', 'state', 'zip_code', 'has_complete_address']
    search_fields = ['user__email', 'city', 'zip_code']
    readonly_fields = ['full_address', 'has_complete_address']
