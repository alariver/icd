/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.dao;

import net.skyatlas.icd.domain.UserInfo;

/**
 *
 * @author changzhenghe
 */
public interface UserDao {
    UserInfo    getUserByNameAndPwd(String name,String passwd);
    
}
