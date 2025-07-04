from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from simulations.models import Model, SimulationParameter
from django.urls import reverse

User = get_user_model()


class SimulationParameterTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com', 
            password='testpass123'
        )
        self.model = Model.objects.create(
            name='Test Model',
            category='actuarial',
            language='python',
            code='# Test code',
            owner=self.user
        )
        
    def test_create_parameter_as_owner(self):
        """Test that model owner can create parameters"""
        self.client.force_authenticate(user=self.user)
        
        url = f'/api/simulations/models/{self.model.id}/parameters/'
        data = {
            'name': 'interest_rate',
            'type': 'number',
            'default_value': '0.05',
            'min_value': 0.0,
            'max_value': 1.0,
            'description': 'Annual interest rate',
            'required': True
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify parameter was created
        param = SimulationParameter.objects.get(model=self.model, name='interest_rate')
        self.assertEqual(param.type, 'number')
        self.assertEqual(param.default_value, '0.05')
        
    def test_create_parameter_permission_denied(self):
        """Test that non-owners cannot create parameters"""
        self.client.force_authenticate(user=self.other_user)
        
        url = f'/api/simulations/models/{self.model.id}/parameters/'
        data = {
            'name': 'test_param',
            'type': 'string',
            'default_value': 'test',
            'description': 'Test parameter'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_list_parameters(self):
        """Test listing parameters for a model"""
        # Create some parameters
        SimulationParameter.objects.create(
            model=self.model,
            name='param1',
            type='number',
            default_value='10'
        )
        SimulationParameter.objects.create(
            model=self.model,
            name='param2',
            type='string',
            default_value='test'
        )
        
        self.client.force_authenticate(user=self.user)
        url = f'/api/simulations/models/{self.model.id}/parameters/'
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_parameter_validation(self):
        """Test parameter value validation"""
        param = SimulationParameter.objects.create(
            model=self.model,
            name='rate',
            type='number',
            min_value=0.0,
            max_value=1.0,
            required=True
        )
        
        # Test valid value
        errors = param.validate_value(0.5)
        self.assertEqual(len(errors), 0)
        
        # Test invalid value (too high)
        errors = param.validate_value(1.5)
        self.assertGreater(len(errors), 0)
        
        # Test missing required value
        errors = param.validate_value(None)
        self.assertGreater(len(errors), 0)
        
    def test_typed_default_value(self):
        """Test that default values are properly typed"""
        param = SimulationParameter.objects.create(
            model=self.model,
            name='rate',
            type='number',
            default_value='0.05'
        )
        
        typed_value = param.get_typed_default_value()
        self.assertEqual(typed_value, 0.05)
        self.assertIsInstance(typed_value, float)


class SimulationExecutionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.model = Model.objects.create(
            name='Test Model',
            category='actuarial',
            language='python',
            code='# Test code',
            owner=self.user
        )
        
        # Create a parameter for the model
        self.param = SimulationParameter.objects.create(
            model=self.model,
            name='interest_rate',
            type='number',
            default_value='0.05',
            min_value=0.0,
            max_value=1.0,
            required=True
        )
        
    def test_run_simulation_with_valid_parameters(self):
        """Test running a simulation with valid parameters"""
        self.client.force_authenticate(user=self.user)
        
        url = '/api/simulations/run/'
        data = {
            'model_id': self.model.id,
            'parameters': {
                'interest_rate': 0.05
            }
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('session_id', response.data)
        
    def test_run_simulation_with_invalid_parameters(self):
        """Test running a simulation with invalid parameters"""
        self.client.force_authenticate(user=self.user)
        
        url = '/api/simulations/run/'
        data = {
            'model_id': self.model.id,
            'parameters': {
                'interest_rate': 1.5  # Invalid: exceeds max_value
            }
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('parameter_errors', response.data)