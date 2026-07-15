# From the CFC introduction-to-backend-development-with-django
# Serialisers are a way to convert Python models to JSON, XML or any other format you wish
# The specific serializer used here is ModelSerializer
# It provides a shortcut that automatically generates a serializer class based on a Django model

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import Ingredient, Recipe, RecipeIngredient, RecipeStep

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