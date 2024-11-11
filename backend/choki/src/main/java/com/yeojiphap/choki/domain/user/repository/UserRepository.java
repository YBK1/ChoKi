package com.yeojiphap.choki.domain.user.repository;

import com.yeojiphap.choki.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u " +
            "WHERE (6371 * ACOS(COS(RADIANS(:latitude)) * COS(RADIANS(u.latitude)) " +
            "* COS(RADIANS(u.longitude) - RADIANS(:longitude)) " +
            "+ SIN(RADIANS(:latitude)) * SIN(RADIANS(u.latitude)))) <= :distance" +
            " AND u.role = 'CHILD'")
    List<User> findUsersWithinRadius(@Param("latitude") double latitude,
                                     @Param("longitude") double longitude, Double distance);

    @Query("SELECT u.username FROM User u "
        + "where u.family.id = "
        + "(SELECT child.family.id FROM User child WHERE child.username = :childUsername) "
        + "AND u.role = 'PARENT'")
    Optional<String> findParentUsernameByChildUsername(@Param("childUsername") String childUsername);
}
