package com.yeojiphap.choki.domain.notification.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.yeojiphap.choki.domain.notification.entity.Notification;
import com.yeojiphap.choki.domain.notification.entity.NotificationType;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
	// n+1 문제 대비용 fetch join
	@Query("SELECT n FROM Notification n JOIN FETCH n.parent p JOIN FETCH n.child c WHERE p.username = :parentId AND c.id = :childId")
	List<Notification> findAllByParentId(@Param("parentId") String parentId, @Param("childId") Long childId);

	@Query("SELECT n.id FROM Notification n WHERE n.child.id = :childId AND n.type = :type")
	Optional<Long> findIdByChildId(@Param("childId") Long childId, @Param("type") NotificationType type);

	void deleteById(Long id);

	@Transactional
	@Modifying
	@Query("DELETE FROM Notification n WHERE n.missionId = :missionId")
	void deleteByMissionId(@Param("missionId") String missionId);
}
