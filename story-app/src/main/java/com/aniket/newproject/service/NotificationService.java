package com.aniket.newproject.service;

import com.aniket.newproject.model.Notification;
import com.aniket.newproject.repo.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getNotificationsByUserId(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(UUID userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndReadFalse(userId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // Helper method to create notifications
    public void createFollowNotification(UUID followerId, UUID followeeId, String followerUsername) {
        Notification notification = new Notification();
        notification.setUserId(followeeId);
        notification.setType("follow");
        notification.setMessage(followerUsername + " started following you");
        notification.setRelatedUserId(followerId);
        createNotification(notification);
    }

    public void createLikeNotification(UUID userId, UUID storyId, UUID authorId, String username, String storyTitle) {
        if (!userId.equals(authorId)) { // Don't notify if user likes their own story
            Notification notification = new Notification();
            notification.setUserId(authorId);
            notification.setType("like");
            notification.setMessage(username + " liked your story \"" + storyTitle + "\"");
            notification.setRelatedUserId(userId);
            notification.setStoryId(storyId);
            createNotification(notification);
        }
    }

    public void createChapterNotification(UUID authorId, UUID storyId, String storyTitle, String authorUsername) {
        // This would typically notify followers of the author
        // For now, we'll just create a placeholder
        Notification notification = new Notification();
        notification.setType("chapter");
        notification.setMessage("New chapter available in \"" + storyTitle + "\" by " + authorUsername);
        notification.setStoryId(storyId);
        // You'd need to get followers and create notifications for each
    }
}
