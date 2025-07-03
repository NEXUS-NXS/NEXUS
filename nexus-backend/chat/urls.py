from django.urls import path
from .views import (CategoryListCreateView, ExamFocusListCreateView, TagListCreateView,
                     ChatUserSearchView, StudyGroupListCreateView,
                     StudyGroupDetailView, JoinRequestCreateView,JoinRequestManageView,
                     GroupMembershipManageView, MessageListCreateView, MessageDeleteView,
                     NotificationListView, LeaveGroupView, JoinGroupByLinkView, PendingJoinRequestsView,
                     CurrentChatUserView, MyStudyGroupsView,GroupMembersView,
                     )

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category-list'),#tested
    path('exam-focus/', ExamFocusListCreateView.as_view(), name='exam-focus-list'),#tested
    path('tags/', TagListCreateView.as_view(), name='tag-list-create'),
    path('users/search/', ChatUserSearchView.as_view(), name='user-search'),#tested

    path('groups/', StudyGroupListCreateView.as_view(), name='group-list-create'),#tested
    path('my-groups/', MyStudyGroupsView.as_view(), name='my-groups'),
    path('groups/<int:pk>/', StudyGroupDetailView.as_view(), name='group-detail'),#tested
    path('groups/<int:group_id>/join/', JoinRequestCreateView.as_view(), name='join-request-create'),#tested
    path('groups/<int:group_id>/pending-requests/', PendingJoinRequestsView.as_view(), name='pending-join-requests'),#tested

    path('groups/<int:group_id>/members/', GroupMembersView.as_view(), name='group-members'),

    path('groups/<int:group_id>/members/<int:user_id>/manage/', GroupMembershipManageView.as_view(), name='group-membership-manage'),#tested
    path('groups/<int:group_id>/messages/', MessageListCreateView.as_view(), name='group-messages'),#tested
    path('groups/<int:group_id>/leave/', LeaveGroupView.as_view(), name='leave-group'),#tested

    path('join-requests/<int:join_request_id>/manage/', JoinRequestManageView.as_view(), name='join-request-manage'),#tested
    path('join/<str:invite_link>/', JoinGroupByLinkView.as_view(), name='join-by-link'),

    path('messages/<int:pk>/delete/', MessageDeleteView.as_view(), name='message-delete'),
    path('dm/<int:recipient_id>/messages/', MessageListCreateView.as_view(), name='dm-view'),#tested
    path('notifications/', NotificationListView.as_view(), name='notification-list'),#tested

    path('api/me/', CurrentChatUserView.as_view(), name='current_chat_user'),
    
]