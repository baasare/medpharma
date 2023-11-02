# import json
# from unittest import TestCase, mock
# from django.test import RequestFactory
# from rest_framework import status
# from rest_framework.test import APIRequestFactory
#
# from django.test import Client
# from accounts.models import Country
# from accounts.serializers import CastleIoLoginMixin
# from accounts.views import User
#
#
# class AccountsTest(TestCase):
#     valid_payload = {
#         'first_name': 'Michael',
#         'last_name': 'Michaelson',
#         'email': 'michael@judy.legal',
#         'marketing': True,
#         'password1': 'VeryVeryStrongPassword@1',
#         'password2': 'VeryVeryStrongPassword@1',
#         'institution': '',
#         'ambassador': True,
#         'whatsapp_number': '020202020202',
#         'country': 'ghana',
#         'query_params': '{}',
#     }
#
#     def setUp(self) -> None:
#         self.client = Client()
#         self.factory = RequestFactory()
#         User.objects.all().delete()
#         Country.objects.get_or_create(name='Ghana', slug='ghana')
#
#     def xtest_registration_works(self, mock_registration_succeeded):
#         response = self.client.post('/accounts/signup/', self.valid_payload)
#
#         self.assertEqual(201, response.status_code)
#
#         request = self.factory.post('accounts/signup/', {
#             'email': 'test@mail.com',
#             'password': 'safePassword',
#         })
#
#         mock_registration_succeeded.assert_called_once_with(
#             request=request,
#             user=response.data['user']
#         )
#
#     def xtest_invalid_email_throws_400(self):
#         payload = {**self.valid_payload, 'email': 'michael@gmail.comm'}
#         response = self.client.post('/accounts/signup/', payload)
#         self.assertEqual(400, response.status_code)
#         self.assertEqual(
#             "Error: The domain name gmail.comm does not exist. "
#             "Please contact support@judy.legal if you're facing challenges",
#             json.loads(response.content.decode())['email'][0])
#
#
# class CustomLoginViewTests(TestCase):
#
#     def setUp(self) -> None:
#         self.user_payload = {
#             'first_name': 'Michael',
#             'last_name': 'Michaelson',
#             'username': 'michaelson',
#             'email': 'michael@judy.legal',
#             'password': 'VeryVeryStrongPassword@1'
#         }
#         self.client = Client()
#         self.castle = CastleIoLoginMixin()
#         self.factory = APIRequestFactory()
#         User.objects.all().delete()
#         self.user = User.objects.create_user(**self.user_payload)
#         self.request = self.factory.post('/accounts/login/', json.dumps({
#             'email': self.user_payload['email'],
#             'password': self.user_payload['password'],
#             'recaptcha_token': 'yvuicapibutytv7b',
#             'castle_request_token': 'test|device:firefox_on_windows|ip:us-ca',
#         }), content_type='application/json')
#
#     def test_login_attempted_called(self):
#         with mock.patch('accounts.serializers.CastleIoLoginMixin.login_attempted_action') as mock_login_attempted:
#             data = {
#                 'email': self.user_payload['email'],
#                 'password': self.user_payload['password'],
#                 'recaptcha_token': 'yvuicapibutytv7b',
#                 'castle_request_token': 'test|device:firefox_on_windows|ip:us-ca',
#             }
#
#             version = '4.1.0'
#             response = self.client.post(f'/accounts/login/?version={version}&env=local', data, format='json', secure=True)
#             mock_login_attempted.assert_called()
#             self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     def test_login_attempted_not_called(self):
#         with mock.patch('accounts.serializers.CastleIoLoginMixin.login_attempted_action') as mock_login_attempted:
#             data = {
#                 'email': self.user_payload['email'],
#                 'password': self.user_payload['password'],
#                 'recaptcha_token': 'yvuicapibutytv7b',
#                 'castle_request_token': 'test|device:firefox_on_windows|ip:us-ca',
#             }
#
#             version = '3.0.0'
#             response = self.client.post(f'/accounts/login/?version={version}&env=local', data, format='json', secure=True)
#             mock_login_attempted.assert_not_called()
#             self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     def test_login_succeeded_called(self):
#         with mock.patch('accounts.serializers.CastleIoLoginMixin.login_succeeded_action') as mock_login_succeeded:
#             data = {
#                 'email': self.user_payload['email'],
#                 'password': self.user_payload['password'],
#                 'recaptcha_token': 'yvuicapibutytv7b',
#                 'castle_request_token': 'test|device:firefox_on_windows|ip:us-ca',
#             }
#
#             version = '4.1.0'
#             response = self.client.post(f'/accounts/login/?version={version}&env=local', data, format='json', secure=True)
#             mock_login_succeeded.assert_called()
#             self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     def test_login_succeeded_not_called(self):
#         with mock.patch('accounts.serializers.CastleIoLoginMixin.login_succeeded_action') as mock_login_succeeded:
#             data = {
#                 'email': self.user_payload['email'],
#                 'password': self.user_payload['password'],
#                 'recaptcha_token': 'yvuicapibutytv7b',
#                 'castle_request_token': 'test|device:firefox_on_windows|ip:us-ca',
#             }
#
#             version = '3.0.0'
#             response = self.client.post(f'/accounts/login/?version={version}&env=local', data, format='json', secure=True)
#             mock_login_succeeded.assert_not_called()
#             self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     def test_login_failed_called(self):
#         with mock.patch('accounts.serializers.CastleIoLoginMixin.login_failed_action') as mock_login_failed:
#             data = {
#                 'email': 'test@mail.com',
#                 'password': 'password',
#                 'recaptcha_token': 'yvuicapibutytv7b',
#                 'castle_request_token': 'test|device:firefox_on_windows|ip:us-ca',
#             }
#
#             version = '4.1.0'
#             response = self.client.post(f'/accounts/login/?version={version}&env=local', data, format='json', secure=True)
#             mock_login_failed.assert_called()
#             self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#
#     def test_login_failed_not_called(self):
#         with mock.patch('accounts.serializers.CastleIoLoginMixin.login_failed_action') as mock_login_failed:
#             data = {
#                 'email': 'test@mail.com',
#                 'password': 'password',
#                 'recaptcha_token': 'yvuicapibutytv7b',
#                 'castle_request_token': 'test|device:firefox_on_windows|ip:us-ca',
#             }
#
#             version = '3.0.0'
#             response = self.client.post(f'/accounts/login/?version={version}&env=local', data, format='json', secure=True)
#             mock_login_failed.assert_not_called()
#             self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
