package edu.bsu.msqrd.api.auth.security.providers;

import edu.bsu.msqrd.api.auth.security.principal.GoogleUser;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.client.authentication.OAuth2LoginAuthenticationToken;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.oidc.authentication.OidcIdTokenDecoderFactory;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.endpoint.OAuth2AccessTokenResponse;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationResponse;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoderFactory;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.util.Assert;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Collection;
import java.util.Map;

public class MSQRDAuthenticationProvider implements AuthenticationProvider {
    private final OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> accessTokenResponseClient;
    private final OAuth2UserService<OidcUserRequest, OidcUser> userService;
    private JwtDecoderFactory<ClientRegistration> jwtDecoderFactory = new OidcIdTokenDecoderFactory();
    private GrantedAuthoritiesMapper authoritiesMapper = (authorities) -> authorities;

    public MSQRDAuthenticationProvider(OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> accessTokenResponseClient, OAuth2UserService<OidcUserRequest, OidcUser> userService) {
        Assert.notNull(accessTokenResponseClient, "accessTokenResponseClient cannot be null");
        Assert.notNull(userService, "userService cannot be null");
        this.accessTokenResponseClient = accessTokenResponseClient;
        this.userService = userService;
    }

    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        OAuth2LoginAuthenticationToken authorizationCodeAuthentication = (OAuth2LoginAuthenticationToken) authentication;
        if (!authorizationCodeAuthentication.getAuthorizationExchange().getAuthorizationRequest().getScopes().contains("openid")) {
            return null;
        } else {
            OAuth2AuthorizationRequest authorizationRequest = authorizationCodeAuthentication.getAuthorizationExchange().getAuthorizationRequest();
            OAuth2AuthorizationResponse authorizationResponse = authorizationCodeAuthentication.getAuthorizationExchange().getAuthorizationResponse();
            if (authorizationResponse.statusError()) {
                throw new OAuth2AuthenticationException(authorizationResponse.getError(), authorizationResponse.getError().toString());
            } else {
                OAuth2Error oauth2Error;
                if (!authorizationResponse.getState().equals(authorizationRequest.getState())) {
                    oauth2Error = new OAuth2Error("invalid_state_parameter");
                    throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
                } else {
                    OAuth2AccessTokenResponse accessTokenResponse;
                    try {
                        accessTokenResponse = this.accessTokenResponseClient.getTokenResponse(new OAuth2AuthorizationCodeGrantRequest(authorizationCodeAuthentication.getClientRegistration(), authorizationCodeAuthentication.getAuthorizationExchange()));
                    } catch (OAuth2AuthorizationException var14) {
                        oauth2Error = var14.getError();
                        throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
                    }

                    ClientRegistration clientRegistration = authorizationCodeAuthentication.getClientRegistration();
                    Map<String, Object> additionalParameters = accessTokenResponse.getAdditionalParameters();
                    if (!additionalParameters.containsKey("id_token")) {
                        OAuth2Error invalidIdTokenError = new OAuth2Error("invalid_id_token", "Missing (required) ID Token in Token Response for Client Registration: " + clientRegistration.getRegistrationId(), null);
                        throw new OAuth2AuthenticationException(invalidIdTokenError, invalidIdTokenError.toString());
                    } else {
                        OidcIdToken idToken = this.createOidcToken(clientRegistration, accessTokenResponse);
                        String requestNonce = authorizationRequest.getAttribute("nonce");
                        if (requestNonce != null) {
                            String nonceHash;
                            try {
                                nonceHash = createHash(requestNonce);
                            } catch (NoSuchAlgorithmException var13) {
                                oauth2Error = new OAuth2Error("invalid_nonce");
                                throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
                            }

                            String nonceHashClaim = idToken.getNonce();
                            if (nonceHashClaim == null || !nonceHashClaim.equals(nonceHash)) {
                                oauth2Error = new OAuth2Error("invalid_nonce");
                                throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
                            }
                        }

                        DefaultOidcUser oidcUser = (DefaultOidcUser) this.userService.loadUser(new OidcUserRequest(clientRegistration, accessTokenResponse.getAccessToken(), idToken, additionalParameters));
                        GoogleUser googleUser = new GoogleUser(oidcUser.getAuthorities(), oidcUser.getIdToken(), oidcUser.getUserInfo());
                        googleUser.setToken(accessTokenResponse);
                        Collection<? extends GrantedAuthority> mappedAuthorities = this.authoritiesMapper.mapAuthorities(googleUser.getAuthorities());
                        OAuth2LoginAuthenticationToken authenticationResult = new OAuth2LoginAuthenticationToken(authorizationCodeAuthentication.getClientRegistration(), authorizationCodeAuthentication.getAuthorizationExchange(), googleUser, mappedAuthorities, accessTokenResponse.getAccessToken(), accessTokenResponse.getRefreshToken());
                        authenticationResult.setDetails(authorizationCodeAuthentication.getDetails());
                        return authenticationResult;
                    }
                }
            }
        }
    }


    public boolean supports(Class<?> authentication) {
        return OAuth2LoginAuthenticationToken.class.isAssignableFrom(authentication);
    }

    private OidcIdToken createOidcToken(ClientRegistration clientRegistration, OAuth2AccessTokenResponse accessTokenResponse) {
        JwtDecoder jwtDecoder = this.jwtDecoderFactory.createDecoder(clientRegistration);

        Jwt jwt;
        try {
            jwt = jwtDecoder.decode((String) accessTokenResponse.getAdditionalParameters().get("id_token"));
        } catch (JwtException var7) {
            OAuth2Error invalidIdTokenError = new OAuth2Error("invalid_id_token", var7.getMessage(), null);
            throw new OAuth2AuthenticationException(invalidIdTokenError, invalidIdTokenError.toString(), var7);
        }

        return new OidcIdToken(jwt.getTokenValue(), jwt.getIssuedAt(), jwt.getExpiresAt(), jwt.getClaims());
    }

    static String createHash(String nonce) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] digest = md.digest(nonce.getBytes(StandardCharsets.US_ASCII));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
    }
}
