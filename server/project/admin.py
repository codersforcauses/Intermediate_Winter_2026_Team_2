# Admin Interface

from django.contrib import admin
from .models import Ingredient, Recipe, RecipeIngredient, RecipeStep

# Register your models here.
@admin.register(Ingredient)
class IngredientsAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_at", "updated_at")
    list_filter = ("name",)
    ordering = ("name",)
    search_fields = ("name",)
    date_hierarchy = "created_at"

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = (
        "id", 
        "created_by", 
        "title", 
        "description", 
        "prep_time_minutes", 
        "serving_size", 
        "created_at", 
        "updated_at"
        )
    search_fields = ("title", "created_by")
    list_filter = ("created_by", "ingredients")
    ordering = ("created_by",)

@admin.register(RecipeIngredient)
class RecipeIngredientAdmin(admin.ModelAdmin):
    list_display = (
        "recipe",
        "ingredient",
        "amount",
        "description"
    )
    ordering = ("recipe", "ingredient")
    list_filter = ("ingredient",)

@admin.register(RecipeStep)
class RecipeStepAdmin(admin.ModelAdmin):
    list_display = (
        "recipe",
        "order",
        "instruction"
    )
    ordering = ("order",)
    list_filter = ("recipe",)
