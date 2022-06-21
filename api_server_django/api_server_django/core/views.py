from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions  # <-- Here

class HelloView(APIView):
    permission_classes = (permissions.IsAuthenticated,)             # <-- And here

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)

