from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils import timezone
from djfractions.models import DecimalFractionField


# Create your models here.

# Enum options for Ingredients.units
# class QuantityUnits(models.TextChoices):
#     # First value: stored value in database
#     # Second value: display name/UI label (human-readable)
#     KILOGRAM = "kg", "Kilogram"
#     GRAM = "g", "Gram"
#     LITRE = "L", "Litre"
#     PIECE = "pc", "Piece"
#     MILILITRE = "ml", "Mililitre"
#     CUPS = "cup", "Cup"
#     TABLESPOON = "tbsp", "Tablespoon"
#     TEASPOON = "tsp", "Teaspoon"
#     EACH = "each", "Each"
#     GALLON = "gal", "Gallon"
#     FLUID_OUNCE = "fl_oz", "Fluid Ounce"
#     PINT = "pt", "Pint"
#     Quart = "qt", "Quart"

class Ingredient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    name = models.CharField(max_length=255, null=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return self.name
    
class Recipe(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")
    title = models.CharField(max_length=255, null=False)
    description = models.TextField(null=False)
    prep_time_minutes = models.IntegerField(null=False) # store as minutes in database
    serving_size = models.IntegerField(null=False)
    ingredients = models.ManyToManyField(Ingredient, through="RecipeIngredient", related_name="recipes")
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(default=timezone.now, editable=False)

    # Display as hours and minutes
    @property
    def prep_time_display(self):
        hours = self.prep_time_minutes // 60
        mins = self.prep_time_minutes % 60

        if hours and mins:
            return f"{hours}h {mins}m"
        elif hours:
            return f"{hours}h"
        else:
            return f"{mins}m"
        
    def __str__(self):
        return self.title
    
class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="recipe_ingredients")
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name="recipe_ingredients")
    amount = models.CharField(max_length=50)
    description = models.CharField(max_length=100, blank=True, default="") # optional, extra info

    def __str__(self):
        return f"{self.amount} {self.ingredient}"
    
    class Meta:
        constraints = [models.UniqueConstraint(fields=["recipe", "ingredient"], name="unique_recipe_ingredient")]
    
class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="steps")
    order = models.PositiveIntegerField()
    instruction = models.TextField()

    class Meta:
        ordering = ["order"]
        constraints = [models.UniqueConstraint(fields=["recipe", "order"], name="unique_recipe_order")]