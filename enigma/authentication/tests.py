import json
from unittest import TestCase, mock
from django.test import RequestFactory
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from django.test import Client

from authentication.models import PATIENT, User, OFFICER, SUPER_ADMIN, ADMIN
from authentication.serializers import ProfileSerializer
from consultation.models import Consultation
from consultation.serializers import ConsultationSerializer


class AuthenticationTest(TestCase):
    payload = {
        'first_name': 'Kofi',
        'last_name': 'Wayo',
        'email': 'kofi@gmail.come',
        'user_type': '',
        'password': 'VeryVeryStrongPassword@1',
        'phone_number': '0503839485',
    }

    def setUp(self) -> None:
        self.client = Client()
        self.factory = RequestFactory()
        User.objects.all().delete()

    def test_user_model(self):
        cases = (
            {'case': 'patient creation',
             'payload': {
                 'id': 1,
                 'first_name': 'Kofi',
                 'last_name': 'Wayo',
                 'email': 'kofi@gmail.com',
                 'user_type': PATIENT,
                 'password': 'VeryVeryStrongPassword@1',
                 'phone_number': '0503839485',
             },
             'expectation': {
                 'case_1': 1,
                 'case_2': '/api/v1/account/users/1',
                 'case_3': 'kofi@gmail.com',
                 'case_4': 'Kofi Wayo',
             }},
            {'case': 'officer creation',
             'payload': {
                 'id': 2,
                 'first_name': 'Adu',
                 'last_name': 'Mensah',
                 'email': 'adu@gmail.com',
                 'user_type': OFFICER,
                 'password': 'VeryVeryStrongPassword@1',
                 'phone_number': '0509382938',
             },
             'expectation': {
                 'case_1': 2,
                 'case_2': '/api/v1/account/users/2',
                 'case_3': 'adu@gmail.com',
                 'case_4': 'Adu Mensah',
             }}
        )

        for case in cases:
            with self.subTest(case['case']):
                user = User(**case['payload'])
                user.save()
                self.assertEqual(user.id, case['expectation']['case_1'])
                self.assertEqual(user.get_absolute_url(),
                                 case['expectation']['case_2'])
                self.assertEqual(user.get_email(),
                                 case['expectation']['case_3'])
                self.assertEqual(str(user), case['expectation']['case_4'])

    def test_authentication_views(self):
        cases = (
            {'case': 'patient creation',
             'payload': {
                 'id': 3,
                 'first_name': 'Kofi',
                 'last_name': 'Wayo',
                 'email': 'kofi@gmail.com',
                 'user_type': PATIENT,
                 'password': 'VeryVeryStrongPassword@1',
                 'phone_number': '0503839485',
             },
             'expectation': {
                 'case_1': status.HTTP_201_CREATED,
                 'case_2': status.HTTP_200_OK,
                 'case_3': status.HTTP_200_OK,
                 'case_4': status.HTTP_205_RESET_CONTENT,
                 'case_5': status.HTTP_200_OK,
             }},

        )

        for case in cases:
            with self.subTest(case['case']):
                res_1 = self.client.post(
                    '/api/v1/account/register', case['payload'])
                res_2 = self.client.post(
                    '/api/v1/account/login',
                    {
                        'email': case['payload']['email'],
                        'password': case['payload']['password'],
                    }
                )
                res_3 = self.client.post(
                    '/api/v1/account/refresh', {'refresh': res_2.data["refresh"]})
                res_4 = self.client.post('/api/v1/account/logout', {'refresh': res_2.data["refresh"]},
                                         **{'HTTP_AUTHORIZATION': f'Bearer {res_3.data["access"]}'})
                res_5 = self.client.get('/api/v1/account/profile',
                                        **{'HTTP_AUTHORIZATION': f'Bearer {res_3.data["access"]}'})

                self.assertEqual(res_1.status_code,
                                 case['expectation']['case_1'])
                self.assertEqual(res_2.status_code,
                                 case['expectation']['case_2'])
                self.assertEqual(res_3.status_code,
                                 case['expectation']['case_3'])
                self.assertEqual(res_4.status_code,
                                 case['expectation']['case_4'])
                self.assertEqual(res_5.status_code,
                                 case['expectation']['case_5'])


class UserViewSetTestCase(TestCase):

    def setUp(self):
        User.objects.all().delete()
        self.client = APIClient()
        self.user_data = {
            'id': 4,
            'first_name': 'Ama',
            'last_name': 'Kwakye',
            'email': 'ama@gmail.com',
            'user_type': SUPER_ADMIN,
            'password': 'VeryVeryStrongPassword@1',
            'phone_number': '0503769485',
        }

        self.url = '/api/v1/account/users'
        self.user_model = User.objects.create(**self.user_data)
        self.serializer = ProfileSerializer(instance=self.user_model)
        self.token = RefreshToken.for_user(self.user_model)

    def test_list_action(self):
        response = self.client.get(f'{self.url}/{self.user_model.id}',
                                   **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.serializer.data)

    def test_retrieve_action(self):
        response = self.client.get(f'{self.url}/{self.user_model.id}',
                                   **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.serializer.data)

    def test_create_action(self):
        new_user_data = {
            'id': 5,
            'first_name': 'Yaa',
            'last_name': 'Hama',
            'email': 'yaa@gmail.com',
            'user_type': PATIENT,
            'password': 'VeryVeryStrongPassword@1',
            'phone_number': '0503839485',
        }
        response = self.client.post(self.url, new_user_data, format='json',
                                    **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Verify that a new model instance was created
        self.assertEqual(User.objects.count(), 2)

    def test_update_action(self):
        updated_data = {'email': 'kwakye@gmail.com', 'user_type': ADMIN}
        response = self.client.patch(f'{self.url}/{self.user_model.id}', updated_data, format='json',
                                     **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        print(response)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user_model.refresh_from_db()
        self.assertEqual(self.user_model.email, 'kwakye@gmail.com')

    def test_destroy_action(self):
        response = self.client.delete(f'{self.url}/{self.user_model.id}',
                                      **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.count(), 0)


class ConsultationViewSetTestCase(TestCase):

    def setUp(self):
        User.objects.all().delete()
        Consultation.objects.all().delete()
        self.client = APIClient()
        self.patient_data = {
            'id': 6,
            'first_name': 'Ama',
            'last_name': 'Kwakye',
            'email': 'ama@gmail.com',
            'user_type': PATIENT,
            'password': 'VeryVeryStrongPassword@1',
            'phone_number': '0503769485',
        }
        self.officer_data = {
            'id': 7,
            'first_name': 'Nana',
            'last_name': 'Boakye',
            'email': 'nana@gmail.com',
            'user_type': SUPER_ADMIN,
            'password': 'VeryVeryStrongPassword@1',
            'phone_number': '0503769485',
        }

        self.patient_model = User.objects.create(**self.patient_data)
        self.patient_serializer = ProfileSerializer(instance=self.patient_data)

        self.officer_model = User.objects.create(**self.officer_data)
        self.officer_serializer = ProfileSerializer(instance=self.officer_data)

        self.token = RefreshToken.for_user(self.officer_model)

        self.consultation_data = {
            "consultation_type": "out_patient",
            "healthcare_provider": "acacia",
            "condition": "malaria",
            "notes": "Fever",
            "medication": "Coartem",
            "officer": self.officer_model,
            "patient": self.patient_model
        }
        self.consultation_model = Consultation.objects.create(
            **self.consultation_data)
        self.serializer = ConsultationSerializer(
            instance=self.consultation_model)

        self.url = '/api/v1/consultation'

    def test_list_action(self):
        response = self.client.get(f'{self.url}/{self.consultation_model.id}',
                                   **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.serializer.data)

    def test_retrieve_action(self):
        response = self.client.get(f'{self.url}/{self.consultation_model.id}',
                                   **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.serializer.data)

    def test_create_action(self):
        new_consultation_data = {
            "consultation_type": "in_patient",
            "healthcare_provider": "acacia",
            "condition": "Cholera",
            "notes": "Diarrhea",
            "medication": "ORS",
            "officer": 7,
            "patient": 6
        }
        response = self.client.post(self.url, new_consultation_data, format='json',
                                    **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

    def test_update_action(self):
        updated_data = {'healthcare_provider': 'nationwide'}
        response = self.client.patch(f'{self.url}/{self.consultation_model.id}', updated_data, format='json',
                                     **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        print(response)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.consultation_model.refresh_from_db()
        self.assertEqual(
            self.consultation_model.healthcare_provider, 'nationwide')

    def test_destroy_action(self):
        response = self.client.delete(f'{self.url}/{self.consultation_model.id}',
                                      **{'HTTP_AUTHORIZATION': f'Bearer {self.token.access_token}'})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Consultation.objects.count(), 0)
