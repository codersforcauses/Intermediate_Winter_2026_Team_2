from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SignupView, CurrentUserView, IngredientViewSet, RecipeStepViewSet, RecipeIngredientViewSet, RecipeViewSet, SavedRecipeViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet, basename='ingredients')
router.register(r'recipe_step', RecipeStepViewSet, basename='recipe_step')
router.register(r'recipe_ingredient', RecipeIngredientViewSet, basename='recipe_ingredient')
router.register(r'recipe', RecipeViewSet, basename='recipe')
router.register('saved_recipes', SavedRecipeViewSet, basename='saved_recipes'),

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('', include(router.urls)),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),
    path('user/', CurrentUserView.as_view(), name='current-user'),

    # Manual endpoints
    path('recipe/<uuid:recipe_id>/recipe_step/', RecipeStepViewSet.as_view({'get': 'list', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name = 'recipe-steps-list'),
    path('recipe/<uuid:recipe_id>/ingredient/', RecipeIngredientViewSet.as_view({'get': 'list', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name = 'recipe-ingredients-list'),

]
