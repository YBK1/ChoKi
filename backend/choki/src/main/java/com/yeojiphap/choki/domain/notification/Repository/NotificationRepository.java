package com.yeojiphap.choki.domain.notification.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.yeojiphap.choki.domain.notification.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
	// n+1 문제 대비용 fetch join
	@Query("SELECT n FROM Notification n JOIN FETCH n.parent p JOIN FETCH n.child c WHERE p.userId = :parentId AND c.id = :childId")
	List<Notification> findAllByParentId(@Param("parentId") String parentId, @Param("childId") Long childId);

	void deleteById(Long id);
}
