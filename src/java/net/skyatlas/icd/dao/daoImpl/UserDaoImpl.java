/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.dao.daoImpl;

import java.sql.ResultSet;
import java.sql.SQLException;
import javax.sql.DataSource;
import net.skyatlas.icd.dao.UserDao;
import net.skyatlas.icd.domain.UserInfo;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

/**
 *
 * @author changzhenghe
 */
public class UserDaoImpl implements UserDao {

    @Override
    public UserInfo getUserByNameAndPwd(String name, String passwd) {
        return (UserInfo)this.jdbcTemplate.queryForObject("select * from person where username = ? and password = ?", new Object[] {name,passwd}, new UserInfoRowMapper());
    }
    
    private     JdbcTemplate    jdbcTemplate;
    
    public      void    setDataSource(DataSource ds) {
        this.jdbcTemplate = new JdbcTemplate(ds);
    }
    
}

class   UserInfoRowMapper implements RowMapper {

    @Override
    public Object mapRow(ResultSet rs, int i) throws SQLException {
        UserInfo u = new UserInfo();
        u.setId(rs.getInt(1));
        u.setUserName(rs.getString(2));
        u.setPassword(rs.getString(3));
        u.setRealName(rs.getString(4));
        u.setOrganization(rs.getString(5));
        u.setContactInformation(rs.getString(6));
        u.setAdministrator(rs.getBoolean(7));
        u.setEditable(rs.getBoolean(8));
        return u;
    }
    
}