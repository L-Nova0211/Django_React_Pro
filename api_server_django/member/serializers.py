from rest_framework import serializers
from . import models

class MemberSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = models.Member
        fields = ('email', 'nickname', 'role', 'is_active')

# and so on for other serizalizers