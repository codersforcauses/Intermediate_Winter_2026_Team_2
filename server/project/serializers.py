# From the CFC introduction-to-backend-development-with-django
# Serialisers are a way to convert Python models to JSON, XML or any other format you wish
# The specific serializer used here is ModelSerializer
# It provides a shortcut that automatically generates a serializer class based on a Django model

from rest_framework import serializers
from .models import Ingredient, Recipe, RecipeIngredient, RecipeStep

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient #ModelName
        fields = "__all__" # List of fields, auto field generation from the model
        read_only_fields = ("id", "created_at")

class RecipeStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeStep
        fields = "__all__"

class RecipeIngredientSerializer(serializers.ModelSerializer):
    # Nests the ingredient objects (better/richer info given)
    ingredient = IngredientSerializer(read_only=True)
    ingredient_id = serializers.PrimaryKeyRelatedField(
        source="ingredient",
        queryset=Ingredient.objects.all(),
        write_only=True
    )
    recipe_title = serializers.ReadOnlyField(source="recipe.title")

    class Meta:
        model = RecipeIngredient
        fields = [
            'recipe',
            'recipe_title',
            'ingredient',
            'ingredient_id',
            'amount',
            'description'
        ]

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(source='recipe_ingredients', many=True, read_only=True)
    class Meta:
        model = Recipe
        fields = "__all__"
        read_only_fields = ("id", "created_at")