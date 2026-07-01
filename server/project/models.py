from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils import timezone
from djfractions.models import DecimalFractionField


# Create your models here.
class QuantityUnits(models.TextChoices):
    # First value: stored value in database
    # Second value: display name/UI label (human-readable)
    KILOGRAM = "kg", "Kilogram"
    GRAM = "g", "Gram"
    LITRE = "L", "Litre"
    PIECE = "pc", "Piece"
    MILILITRE = "ml", "Mililitre"
    CUPS = "cups", "Cups"

class Ingredients(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, null=False)
    quantity = DecimalFractionField(decimal_places=3, max_digits=10, null=False)
    unit = models.CharField(max_length= 20, choices=QuantityUnits.choices, null=False)
    description = models.CharField(max_length=255, blank=True, default="") # optional, extra info
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f"Ingredient {self.name} ({self.id})"