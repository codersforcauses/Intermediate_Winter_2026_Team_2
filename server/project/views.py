# From the CFC introduction-to-backend-development-with-django
# Views are the logic that handles the requests and responses
# Views have different ways to be created
# Recommend using class-based views (ViewSet) for most use cases
#  -- more concise and easier to extend if you are always using the same pattern of accessing the database

from django.shortcuts import render
from django.contrib.auth import get_user_model
# Create your views here.
from rest_framework import generics, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken # Issues login tokens after user signs up
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from .models import Ingredient, Recipe, RecipeIngredient, RecipeStep, SavedRecipe
from .serializers import SignupSerializer, IngredientSerializer, RecipeStepSerializer, RecipeIngredientSerializer, RecipeSerializer, RecipeCreateSerializer, SavedRecipeSerializer

User = get_user_model()

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "user": {"id": user.id, "username": user.username, "email": user.email},
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=201)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })
    
class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class RecipeStepViewSet(viewsets.ModelViewSet):
    serializer_class = RecipeStepSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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
    queryset = Recipe.objects.all().order_by("-created_at")
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_class(self):
        if self.action == "create":
            return RecipeCreateSerializer
        return RecipeSerializer
    
class SavedRecipeViewSet(viewsets.ModelViewSet):
    serializer_class = SavedRecipeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedRecipe.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"], url_path="toggle")
    def toggle(self, request):
        recipe_id = request.data.get("recipe_id")
        if not recipe_id:
            return Response({"error": "recipe_id is required"}, status=400)

        saved_qs = SavedRecipe.objects.filter(user=request.user, recipe_id=recipe_id)
        if saved_qs.exists():
            saved_qs.delete()
            return Response({"saved": False})
        else:
            SavedRecipe.objects.create(user=request.user, recipe_id=recipe_id)
            return Response({"saved": True})