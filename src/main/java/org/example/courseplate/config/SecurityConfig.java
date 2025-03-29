package org.example.courseplate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        http
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/**").permitAll() // 이 경로는 모두 허용
                        .anyRequest().authenticated()           // 나머지는 인증 필요
                );
                /*
                //crsf(Cross site Request forgery) 설정 disable
                .csrf((csrfConfig) ->
                        csrfConfig.disable()
                )
                //h2-console 화면을 사용하기 위해 해당옵션 disable
                .headers((headerConfig) ->
                        headerConfig.frameOptions(frameOptionsConfig ->
                                frameOptionsConfig.disable()
                        )
                )
                //권한설정
                .authorizeHttpRequests((authorizeRequests) ->
                        authorizeRequests
                                .requestMatchers( "/").permitAll()
                                .requestMatchers( "/users/**").permitAll()
                                .requestMatchers( "/auth/**").permitAll()
                                .requestMatchers( "/places/**").permitAll()
                                .anyRequest().authenticated()
                );*/
        return  http.build();
    }

    @Bean
    public BCryptPasswordEncoder encode() {
        return new BCryptPasswordEncoder();
    }
}