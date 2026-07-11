# From the CFC introduction-to-backend-development-with-django
# Views are the logic that handles the requests and responses
# Views have different ways to be created
# Recommend using class-based views (ViewSet) for most use cases
#  -- more concise and easier to extend if you are always using the same pattern of accessing the database

from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from .models import Ingredient, Recipe, RecipeIngredient, RecipeStep
from .serializers import IngredientSerializer, RecipeStepSerializer, RecipeIngredientSerializer, RecipeSerializer

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticated]

class RecipeStepViewSet(viewsets.ModelViewSet):
    serializer_class = RecipeStepSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        recipe_id = self.kwargs.get('recipe_id') # get recipe_id from the URL
        if recipe_id:
            return RecipeStep.objects.filter(recipe_id=recipe_id)
        return RecipeStep.objects.all()

class RecipeIngredientViewSet(viewsets.ModelViewSet):
    serializer_class = RecipeIngredientSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        recipe_id = self.kwargs.get('recipe_id') # get recipe_id from the URL
        if recipe_id:
            return RecipeIngredient.objects.filter(recipe_id=recipe_id)
        return RecipeIngredient.objects.all()

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]