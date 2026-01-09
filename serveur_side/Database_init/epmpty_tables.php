<?php

-- 1️⃣ Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    review_id CHAR(36) NOT NULL PRIMARY KEY,
    reviewer_id CHAR(36) NOT NULL,
    offre_id CHAR(36) NOT NULL,
    typece ENUM('Like', 'Dislike', 'none') DEFAULT 'none',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE,
    FOREIGN KEY (offre_id) REFERENCES offres_stage(offre_id) ON DELETE CASCADE
);

-- 2️⃣ Bookmark table
CREATE TABLE IF NOT EXISTS bookmark (
    bookmark_id CHAR(36) NOT NULL PRIMARY KEY,
    bookmark_user CHAR(36) NOT NULL,
    offre_id CHAR(36) NOT NULL,
    type ENUM('Bookmark', 'none') DEFAULT 'none',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bookmark_user) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE,
    FOREIGN KEY (offre_id) REFERENCES offres_stage(offre_id) ON DELETE CASCADE
);

-- 3️⃣ Messages table
CREATE TABLE IF NOT EXISTS messages (
    message_id CHAR(36) NOT NULL PRIMARY KEY,
    message_content VARCHAR(300) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    receiver_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
);

-- 4️⃣ Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id CHAR(36) NOT NULL PRIMARY KEY,
    notification_content VARCHAR(255) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    receiver_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES messages(sender_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES messages(receiver_id) ON DELETE CASCADE
);


?>