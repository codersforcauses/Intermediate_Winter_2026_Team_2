from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IngredientViewSet, RecipeStepViewSet, RecipeIngredientViewSet, RecipeViewSet

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet, basename='ingredients')
router.register(r'recipe_step', RecipeStepViewSet, basename='recipe_step')
router.register(r'recipe_ingredient', RecipeIngredientViewSet, basename='recipe_ingredient')
router.register(r'recipe', RecipeViewSet, basename='recipe')

urlpatterns = [
    path('', include(router.urls)),

    # Manual endpoints
    path('recipe/<uuid:recipe_id>/recipe_step/', RecipeStepViewSet.as_view({'get': 'list', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name = 'recipe-steps-list'),
    path('recipe/<uuid:recipe_id>/ingredient/', RecipeIngredientViewSet.as_view({'get': 'list', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name = 'recipe-ingredients-list'),

]
