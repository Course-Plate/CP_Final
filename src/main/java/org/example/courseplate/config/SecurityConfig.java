    package org.example.courseplate.config;

    import com.fasterxml.jackson.databind.ObjectMapper;
    import lombok.Getter;
    import lombok.RequiredArgsConstructor;
    import org.example.courseplate.security.JwtAuthenticationFilter;
    import org.example.courseplate.security.JwtUtil;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.MediaType;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.web.AuthenticationEntryPoint;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.access.AccessDeniedHandler;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;;

    import java.io.PrintWriter;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        private final JwtUtil jwtUtil;

        public SecurityConfig(JwtUtil jwtUtil){
            this.jwtUtil = jwtUtil;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

            http
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
                                    .requestMatchers( "/places/add").permitAll()
                                    .requestMatchers( "/users/**").permitAll()
                                    .requestMatchers( "/auth/**").permitAll()
                                    .anyRequest().authenticated()
                    )
                    .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class) // 필터 등록
                    .exceptionHandling((exceptionConfig) ->
                            exceptionConfig.authenticationEntryPoint(unauthorizedEntryPoint).accessDeniedHandler(accessDeniedHandler)
                    ); // 401 403 관련 예외처리
            return  http.build();
        }

        //401 예외처리
        private final AuthenticationEntryPoint unauthorizedEntryPoint =
                (request, response, authException) -> {
                    ErrorResponse fail = new ErrorResponse(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED...");
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    String json = new ObjectMapper().writeValueAsString(fail);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    PrintWriter writer = response.getWriter();
                    writer.write(json);
                    writer.flush();
                };

        //403 예외처리
        private final AccessDeniedHandler accessDeniedHandler =
                (request, response, accessDeniedException) -> {
                    ErrorResponse fail = new ErrorResponse(HttpStatus.FORBIDDEN, "FORBIDDEN...");
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    String json = new ObjectMapper().writeValueAsString(fail);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    PrintWriter writer = response.getWriter();
                    writer.write(json);
                    writer.flush();
                };

        @Getter
        @RequiredArgsConstructor
        public class ErrorResponse {

            private final HttpStatus status;
            private final String message;
        }


        @Bean
        public BCryptPasswordEncoder encode() {
            return new BCryptPasswordEncoder();
        }
    }