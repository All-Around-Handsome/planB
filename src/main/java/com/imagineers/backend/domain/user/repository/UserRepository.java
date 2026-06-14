package com.imagineers.backend.domain.user.repository;

import com.imagineers.backend.domain.user.entity.User;
import com.imagineers.backend.global.enums.OauthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 소셜 로그인 시 기존 회원 찾을 때 사용 (A-012)
    // SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?
    Optional<User> findByOauthProviderAndOauthId(OauthProvider provider, String oauthId);

    // 이메일로 회원 찾을 때 사용
    // SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}