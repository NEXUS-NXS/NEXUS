from django.urls import path
from .views import (CategoryListView, ExamFocusListView, TagListView,
                     ChatUserSearchView, StudyGroupListCreateView,
                     StudyGroupDetailView, JoinRequestCreateView,JoinRequestManageView,
                     GroupMembershipManageView, MessageListCreateView, MessageDeleteView,
                     NotificationListView, LeaveGroupView, JoinGroupByLinkView
                     )

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('exam-focus/', ExamFocusListView.as_view(), name='exam-focus-list'),
    path('tags/', TagListView.as_view(), name='tag-list'),
    path('users/search/', ChatUserSearchView.as_view(), name='user-search'),

    path('groups/', StudyGroupListCreateView.as_view(), name='group-list-create'),
    path('groups/<int:pk>/', StudyGroupDetailView.as_view(), name='group-detail'),
    path('groups/<int:group_id/join/>', JoinRequestCreateView.as_view(), name='join-request-create'),
    path('groups/<int:group_id>/members/<int:user_id>/manage/', GroupMembershipManageView.as_view(), name='group-membership-manage'),
    path('groups/<int:group_id>/messages/', MessageListCreateView.as_view(), name='group-messages'),
    path('groups/<int:group_id/leave/>', LeaveGroupView.as_view(), name='leave-group'),

    path('join-requests/<int:join_request_id>/manage/', JoinRequestManageView.as_view(), name='join-request-manage'),
    path('join/<str:invite_link>/', JoinGroupByLinkView.as_view(), name='join-by-link'),
    
    path('messages/<int:pk>/delete/', MessageDeleteView.as_view(), name='message-delete'),
    path('dm/<int:recipient_id>/messages/', MessageListCreateView.as_view(), name='dm-view'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    
]