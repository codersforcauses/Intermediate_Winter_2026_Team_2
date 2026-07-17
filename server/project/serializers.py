# From the CFC introduction-to-backend-development-with-django
# Serialisers are a way to convert Python models to JSON, XML or any other format you wish
# The specific serializer used here is ModelSerializer
# It provides a shortcut that automatically generates a serializer class based on a Django model

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Ingredient, Recipe, RecipeIngredient, RecipeStep, SavedRecipe

User = get_user_model() # returns current active User model 

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    verify_pass = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'verify_pass')

    # https://www.django-rest-framework.org/api-guide/validators/#advanced-field-defaults
    # comparing fields together
    def validate(self, attrs):
        if attrs['password'] != attrs['verify_pass']:
            raise serializers.ValidationError( {"password": "Passwords don't match."})
        return attrs
    
    # validate only one single field
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value
    
    def create(self, validated_data):
        validated_data.pop('verify_pass')
        user = User.objects.create_user(
            username = validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


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

    def get_is_saved(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.saved_by.filter(user=request.user).exists()

class RecipeCreateSerializer(serializers.ModelSerializer):
    ingredients = serializers.JSONField(write_only=True)
    steps = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = Recipe
        fields = ["id", "title", "description", "prep_time_minutes", "serving_size", "ingredients", "steps"]
        read_only_fields = ["id"]

    def validate_ingredients(self, value):
        if not value:
            raise serializers.ValidationError("At least one ingredient is required.")
        for item in value:
            if not item.get("ingredient_name"):
                raise serializers.ValidationError("Each ingredient needs a name.")
        return value

    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients", [])
        steps_data = validated_data.pop("steps", [])
        request = self.context["request"]

        recipe = Recipe.objects.create(created_by=request.user, **validated_data)

        for item in ingredients_data:
            ingredient_obj, _ = Ingredient.objects.get_or_create(
                name=item["ingredient_name"].strip().lower()
            )
            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient=ingredient_obj,
                amount=item.get("amount", ""),
                description=item.get("description", ""),
            )

        for idx, instruction in enumerate(steps_data, start=1):
            if instruction.strip():
                RecipeStep.objects.create(recipe=recipe, order=idx, instruction=instruction.strip())

        return recipe
    
class SavedRecipeSerializer(serializers.ModelSerializer):
    recipe = RecipeSerializer(read_only=True)
    recipe_id = serializers.PrimaryKeyRelatedField(
        source="recipe", queryset=Recipe.objects.all(), write_only=True
    )

    class Meta:
        model = SavedRecipe
        fields = ["id", "recipe", "recipe_id", "saved_at"]
