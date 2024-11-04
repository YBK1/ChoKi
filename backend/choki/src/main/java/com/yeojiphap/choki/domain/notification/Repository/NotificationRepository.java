package com.yeojiphap.choki.domain.notification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.yeojiphap.choki.domain.notification.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
	// n+1 문제 대비용 fetch join
	@Query("SELECT n FROM Notification n JOIN FETCH n.parent, n.child WHERE n.parent.userId = :parentId AND n.child.id = :childId")
	List<Notification> findAllByParentId(String parentId, Long childId);

	void deleteById(Long id);
}
