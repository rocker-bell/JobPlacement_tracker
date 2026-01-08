<?php

    $reviews= 'CREATE TABLE reviews (
        review_id varchar(36) uuid,
        reviewer_id varchar(36),
        offre_id varchar(36),
        typece varchar(20) enum('Like', 'Dislike', 'none')
        created_at
        updated_at
        reviewer_id foreign key references utilisateurs(user_id)
        offre_id foreing key references offre_stages(offre_id)

    )';

    $BookMark = 'CREATE TABLE bookmark (
        bookmark_id  varchar(36) uuid,
        bookmark_user varchar(36),
        offre_id  varchar(36).
        type varchar(20)  enum('Bookmark', 'none')
        created_at
        updated_at
        bookmark_id foreign key references utilisateurs(user_id)
        offre_id foreing key references offre_stages(offre_id)
    )';


    $messages =  'CREATE TABLE messages (
        message_id varchar(36) uuid,
        message_content varchar(300),
        sender_id varchar(36).
        receiver_id varchar(36),
        created_at
        updated_at
        sender_id foreign key references utilisateurs(user_id),
        receiver_id foreign key references utilisateurs(user_id)
    )'

    $notification = 'CREATE TABLE notifications (
        notifications_id varchar(36) uuid,
        notification_content varchar(36)
        sender_id varchar(36)
        receiver_id varchar(36)
        created_at date default currdate()
        updated_at
        sender_id  foreign key references message(sender_id)
        notification_content foreign key references message(message_id)
        sender_id  foreign key references message(sender_id)
        receiver foreign key references message(receiver_id)
    )'






?>