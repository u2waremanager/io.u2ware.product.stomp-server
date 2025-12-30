package io.u2ware.product.stomp.server;

import java.io.IOException;
import java.util.Collection;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfigurationSource;

import io.u2ware.common.oauth2.jwt.JwtConfiguration;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class ApplicationSecurityConfig {

	protected Log logger = LogFactory.getLog(getClass());


    @Autowired
    private CorsConfigurationSource corsConfigurationSource;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors-> cors
                    .configurationSource(corsConfigurationSource)
            )
            .headers(headers -> headers
                    .frameOptions(frameOptions -> frameOptions
                            .sameOrigin()
                    ))

            .authorizeHttpRequests(authorize -> 
                    authorize
                        .requestMatchers(HttpMethod.GET, "/api").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/profile/**").permitAll()
                        .requestMatchers("/stomp/**").authenticated()
                        .anyRequest().permitAll()
            )

            .formLogin(formLogin -> 
                formLogin
                    .loginPage("/login").permitAll()
                    .successHandler(new AuthenticationSuccessHandler(){

                        @Override
                        public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                            System.err.println(request);
                            System.err.println(response);
                            System.err.println(authentication);
                            System.err.println(request.getParameterMap());
                            System.err.println(request.getParameter("hello"));
                        }

                })
            )
            .oauth2ResourceServer(
                    oauth2->oauth2.jwt(Customizer.withDefaults())
            );
        
        return http.build();
    }

	@Bean
	public UserDetailsService userDetailsService() {
		UserDetails userDetails = User.withDefaultPasswordEncoder()
			.username("a")
			.password("a")
			.roles("USER")
			.build();

		return new InMemoryUserDetailsManager(userDetails);
	}


    @Bean
    public BearerTokenResolver bearerTokenResolver() {
        DefaultBearerTokenResolver r = new DefaultBearerTokenResolver();
        r.setAllowUriQueryParameter(true); //?access_token GET only
        return r;
    }

    
    private @Autowired(required = false) Converter<Jwt, Collection<GrantedAuthority>> jwtGrantedAuthoritiesConverter;
	private @Autowired OAuth2ResourceServerProperties oauth2ResourceServerProperties;

    @Bean
    public JwtConfiguration jwtConfiguration() throws Exception {
        return new JwtConfiguration(oauth2ResourceServerProperties);
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(JwtConfiguration jwtConfiguration) {
        return jwtConfiguration.jwtConverter(jwtGrantedAuthoritiesConverter);
    }

    @Bean
    public JwtDecoder jwtDecoder(JwtConfiguration jwtConfiguration) throws Exception {
        return jwtConfiguration.jwtDecoder();
    }
}