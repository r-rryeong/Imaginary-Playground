package com.yodel.imaginaryPlayground.service.oauth;

import com.yodel.imaginaryPlayground.model.oauth.OAuthAttributes;
import com.yodel.imaginaryPlayground.model.dto.UserDto;
import com.yodel.imaginaryPlayground.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2UserService oAuth2UserService = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = oAuth2UserService.loadUser(oAuth2UserRequest);

        // 현재 진행중인 서비스를 구분하기 위해 문자열로 받음. oAuth2UserRequest.getClientRegistration().getRegistrationId()에 값이 들어있다. {registrationId='naver'} 이런식으로
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();

        // OAuth2 로그인 시 키 값이 된다. 구글은 키 값이 "sub"이고, 네이버는 "response"이고, 카카오는 "id"이다. 각각 다르므로 이렇게 따로 변수로 받아서 넣어줘야함.
        String userNameAttributeName = oAuth2UserRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // OAuth2 로그인을 통해 가져온 OAuth2User의 attribute를 담아주는 of 메소드.
        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        int saveOrlogin = saveOrUpdate(attributes);
        System.out.println("통합 로그인 성공 여부: "+saveOrlogin);

        var userAttribute = attributes.convertToMap(); // Map으로 한 번 감싸준다.

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                userAttribute //OAuthAttributes.getAttributes() 로 보내는게 원칙이나 구조가 모두 깨져서 도착해 Map으로 감싸서 보낸다.(깨진 구조 모양은 success 핸들러 참고)
                , "email");
    }


    //혹시 이미 저장된 정보라면, update 처리
    private int saveOrUpdate(OAuthAttributes attributes) {
        int findUser = userService.countByEmail(attributes.getEmail());

        UserDto user = new UserDto();

        if(findUser == 0){
           user.setEmail(attributes.getEmail());
           user.setUsername(attributes.getUsername());
           user.setProvider(attributes.getProvider());

           findUser = userService.saveUser(user);
        }

        System.out.println("findUser : " + findUser);
        if(findUser == 1){
            user = userService.findByEmail(attributes.getEmail()); //구현 필요
        }

        System.out.printf("saveOrupdate, 소셜 로그인 진행: "+user.toString());
        return findUser;
    }
}