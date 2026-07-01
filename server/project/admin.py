# Admin Interface

from django.contrib import admin
from .models import Ingredients

# Register your models here.
@admin.register(Ingredients)
class IngredientsAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "quantity", "unit", "description")
    list_filter = ("name",)
    ordering = ("name",)
    search_fields = ("name",)
