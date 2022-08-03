package com.yodel.imaginaryPlayground.service;

import com.yodel.imaginaryPlayground.controller.UserController;
import com.yodel.imaginaryPlayground.model.dto.UserDto;
import com.yodel.imaginaryPlayground.model.vo.EmailCodeVO;

import java.sql.SQLException;
import java.util.Map;

public interface UserService {

    int saveUser(UserDto user);
    int updateUserInfo(String username) throws Exception;
    UserDto detailUser(int userId) throws Exception;
    int deleteUser(int userId) throws Exception;
    // 사용자 전체 검색은 사용하지 않을 것 같아서 제외
    int countByEmail(String email);
    UserDto findByEmail(String email);
    int saveFile(String document, String email);
    int saveEmailAuth(String email, String CODE);
    int authEmailCode(EmailCodeVO emailCodeVO);
    int deleteEmailCode(String email);
}
